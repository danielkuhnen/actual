import { send } from '@actual-app/core/platform/client/connection';
import type { GoCardlessToken } from '@actual-app/core/types/models';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { authorizeBank, stopWatchingGoCardlessLink } from './gocardless';
import type { AppDispatch } from './redux/store';

vi.mock('@actual-app/core/platform/client/connection', () => ({
  send: vi.fn(),
}));

const linkedToken: GoCardlessToken = { id: 'req-1', accounts: [] };

type Check =
  | { status: 'linked'; data: GoCardlessToken }
  | { status: 'pending' }
  | 'no-answer';

function mockServer(checks: Record<string, Check[]>) {
  let created = 0;
  const checked: string[] = [];
  vi.mocked(send).mockImplementation(((name: string, args: unknown) => {
    if (name === 'gocardless-create-web-token') {
      created += 1;
      return Promise.resolve({
        link: `https://bank.example/${created}`,
        requisitionId: `req-${created}`,
      });
    }
    if (name === 'gocardless-check-web-token') {
      const { requisitionId } = args as { requisitionId: string };
      checked.push(requisitionId);
      const next = checks[requisitionId]?.shift() ?? { status: 'pending' };
      if (next === 'no-answer') {
        return new Promise(() => undefined);
      }
      return Promise.resolve(next);
    }
    throw new Error(`Unexpected call: ${name}`);
  }) as typeof send);
  return { checked };
}

function openLinkModal() {
  const dispatch = vi.fn();
  void authorizeBank(dispatch as unknown as AppDispatch);
  const action = dispatch.mock.calls[0][0];
  return action.payload.modal.options.onMoveExternal as (arg: {
    institutionId: string;
  }) => Promise<unknown>;
}

describe('GoCardless bank link', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.Actual = {
      ...window.Actual,
      openURLInBrowser: vi.fn(),
    };
  });

  afterEach(() => {
    stopWatchingGoCardlessLink();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('keeps checking until the bank link completes', async () => {
    mockServer({
      'req-1': [
        { status: 'pending' },
        { status: 'pending' },
        { status: 'linked', data: linkedToken },
      ],
    });

    const result = openLinkModal()({ institutionId: 'N26_NTSBDEB1' });
    await vi.advanceTimersByTimeAsync(10_000);

    await expect(result).resolves.toEqual({ data: linkedToken });
  });

  it('asks again when a check never gets an answer', async () => {
    const { checked } = mockServer({
      'req-1': ['no-answer', { status: 'linked', data: linkedToken }],
    });

    const result = openLinkModal()({ institutionId: 'N26_NTSBDEB1' });
    await vi.advanceTimersByTimeAsync(70_000);

    await expect(result).resolves.toEqual({ data: linkedToken });
    expect(checked).toEqual(['req-1', 'req-1']);
  });

  it('picks up an earlier link when linking was started twice', async () => {
    mockServer({
      'req-1': [{ status: 'pending' }, { status: 'linked', data: linkedToken }],
    });

    const onMoveExternal = openLinkModal();
    const first = onMoveExternal({ institutionId: 'N26_NTSBDEB1' });
    const second = onMoveExternal({ institutionId: 'N26_NTSBDEB1' });
    await vi.advanceTimersByTimeAsync(10_000);

    await expect(first).resolves.toEqual({ data: linkedToken });
    await expect(second).resolves.toEqual({ data: linkedToken });
  });

  it('stops checking once the modal is closed', async () => {
    const { checked } = mockServer({});

    void openLinkModal()({ institutionId: 'N26_NTSBDEB1' });
    await vi.advanceTimersByTimeAsync(1_000);
    stopWatchingGoCardlessLink();
    const checksBeforeStop = checked.length;
    await vi.advanceTimersByTimeAsync(30_000);

    expect(checked.length).toBe(checksBeforeStop);
  });

  it('gives up after ten minutes', async () => {
    mockServer({});

    const result = openLinkModal()({ institutionId: 'N26_NTSBDEB1' });
    await vi.advanceTimersByTimeAsync(10 * 60 * 1_000 + 5_000);

    await expect(result).resolves.toEqual({ error: 'timeout' });
  });
});
