import { send } from '@actual-app/core/platform/client/connection';
import type {
  AccountEntity,
  GoCardlessToken,
} from '@actual-app/core/types/models';

import { pushModal } from './modals/modalsSlice';
import type { AppDispatch } from './redux/store';

const LINK_CHECK_INTERVAL_MS = 3_000;
// Generous on purpose: once the bank is linked the server fetches the
// account details, which can take a while, and every retry spends one of
// the bank's daily API calls.
const LINK_CHECK_TIMEOUT_MS = 60_000;
const LINK_TIMEOUT_MS = 10 * 60 * 1_000;

type LinkResult =
  | { error: 'timeout' }
  | { error: 'unknown'; message?: string }
  | { data: GoCardlessToken };

type LinkWatch = {
  requisitionIds: string[];
  isStopped: boolean;
};

let activeWatch: { watch: LinkWatch; result: Promise<LinkResult> } | null =
  null;

// The bank link is checked from the UI, one short request at a time, rather
// than in one long-running backend call. While the user is at their bank
// this tab sits in the background, and the browser can suspend it; when it
// resumes, its backend Worker may be replaced (another tab took over the
// budget), which silently drops any request in flight. Short requests with
// a timeout simply get asked again.
function watchRequisition(requisitionId: string): Promise<LinkResult> {
  // "Link bank in browser" can be pressed again (or the "not opening?"
  // link used), which creates another requisition. Keep watching all of
  // them, so whichever one the user completes is picked up.
  if (activeWatch && !activeWatch.watch.isStopped) {
    activeWatch.watch.requisitionIds.push(requisitionId);
    return activeWatch.result;
  }

  const watch: LinkWatch = {
    requisitionIds: [requisitionId],
    isStopped: false,
  };
  const result = pollUntilLinked(watch);
  activeWatch = { watch, result };
  void result.finally(() => {
    if (activeWatch?.watch === watch) {
      activeWatch = null;
    }
  });
  return result;
}

export function stopWatchingGoCardlessLink() {
  if (activeWatch) {
    activeWatch.watch.isStopped = true;
    activeWatch = null;
  }
}

async function pollUntilLinked(watch: LinkWatch): Promise<LinkResult> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < LINK_TIMEOUT_MS) {
    for (const requisitionId of [...watch.requisitionIds]) {
      const check = await checkRequisition(requisitionId);
      if (watch.isStopped) {
        // The modal was closed. Like the backend poll's stop, a stopped
        // watch never settles.
        return new Promise<LinkResult>(() => undefined);
      }
      if (!check) {
        continue;
      }
      if ('error' in check) {
        return check;
      }
      if (check.status === 'linked') {
        return { data: check.data };
      }
    }

    await new Promise(resolve => setTimeout(resolve, LINK_CHECK_INTERVAL_MS));
    if (watch.isStopped) {
      return new Promise<LinkResult>(() => undefined);
    }
  }

  return { error: 'timeout' };
}

// Resolves to null when the request got no answer in time.
async function checkRequisition(
  requisitionId: string,
): Promise<
  | { status: 'linked'; data: GoCardlessToken }
  | { status: 'pending' }
  | { error: 'unknown'; message?: string }
  | null
> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>(resolve => {
    timeoutId = setTimeout(() => resolve(null), LINK_CHECK_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      send('gocardless-check-web-token', { requisitionId }),
      timeout,
    ]);
  } catch (error) {
    return {
      error: 'unknown',
      message: error instanceof Error ? error.message : undefined,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function _authorize(
  dispatch: AppDispatch,
  {
    onSuccess,
    onClose,
  }: {
    onSuccess: (data: GoCardlessToken) => Promise<void>;
    onClose?: () => void;
  },
) {
  dispatch(
    pushModal({
      modal: {
        name: 'gocardless-external-msg',
        options: {
          onMoveExternal: async ({ institutionId }) => {
            const resp = await send('gocardless-create-web-token', {
              institutionId,
              accessValidForDays: 90,
            });

            if ('error' in resp) return resp;
            if ('error_code' in resp) {
              return { error: 'unknown', message: resp.error_type };
            }
            const { link, requisitionId } = resp;
            window.Actual.openURLInBrowser(link);

            return watchRequisition(requisitionId);
          },
          onClose,
          onSuccess,
        },
      },
    }),
  );
}

export async function authorizeBank(
  dispatch: AppDispatch,
  upgradingAccountId?: AccountEntity['id'],
) {
  _authorize(dispatch, {
    onSuccess: async data => {
      dispatch(
        pushModal({
          modal: {
            name: 'select-linked-accounts',
            options: {
              externalAccounts: data.accounts,
              requisitionId: data.id,
              syncSource: 'goCardless',
              upgradingAccountId,
            },
          },
        }),
      );
    },
  });
}
