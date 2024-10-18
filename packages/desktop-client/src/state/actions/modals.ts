import { type ComponentPropsWithoutRef } from 'react';

import {
  type AccountEntity,
  type AccountSyncSource,
  type CategoryEntity,
  type CategoryGroupEntity,
  type GoCardlessToken,
  type NewRuleEntity,
  type RuleEntity,
  type ScheduleEntity,
  type TransactionEntity,
} from 'loot-core/types/models';
import { type EmptyObject } from 'loot-core/types/util';

import { type FixEncryptionKeyModal } from '../../components/modals/FixEncryptionKeyModal';
import * as constants from '../constants';

type NoOptions = EmptyObject;

type ImportTransactionsModal = {
  name: 'import-transactions';
  options: {
    accountId: string;
    filename: string;
    onImported: (didChange: boolean) => void;
  };
};

type AddAccountModal = {
  name: 'add-account';
  options: NoOptions;
};

type AddLocalAccountModal = {
  name: 'add-local-account';
  options: NoOptions;
};

type CloseAccountModal = {
  name: 'close-account';
  options: {
    account: AccountEntity;
    balance: number;
    canDelete: boolean;
  };
};

type SelectLinkedAccountsModal = {
  name: 'select-linked-accounts';
  options: {
    accounts: unknown[];
    requisitionId?: string;
    upgradingAccountId?: string;
    syncSource?: AccountSyncSource;
  };
};

type ConfirmCategoryDeleteModal = {
  name: 'confirm-category-delete';
  options: { onDelete: (categoryId: string) => void } & (
    | { category: string }
    | { group: string }
  );
};

type LoadBackupModal = {
  name: 'load-backup';
  options: NoOptions;
};

type ManageRulesModal = {
  name: 'manage-rules';
  options: { payeeId?: string };
};

type EditRuleModal = {
  name: 'edit-rule';
  options: {
    rule: RuleEntity | NewRuleEntity;
    onSave?: (rule: RuleEntity) => void;
  };
};

type MergeUnusedPayeesModal = {
  name: 'merge-unused-payees';
  options: {
    payeeIds: string[];
    targetPayeeId: string;
  };
};

type GoCardlessInitModal = {
  name: 'gocardless-init';
  options: {
    onSuccess: () => void;
  };
};

type SimplefinInitModal = {
  name: 'simplefin-init';
  options: {
    onSuccess: () => void;
  };
};

type GoCardlessExternalMsgModal = {
  name: 'gocardless-external-msg';
  options: {
    onMoveExternal: (arg: {
      institutionId: string;
    }) => Promise<{ error: string } | { data: unknown }>;
    onClose?: () => void;
    onSuccess: (data: GoCardlessToken) => Promise<void>;
  };
};

type DeleteBudgetModal = {
  name: 'delete-budget';
  options: { file: File };
};

type ImportModal = {
  name: 'import';
  options: NoOptions;
};

type ImportYnab4Modal = {
  name: 'import-ynab4';
  options: NoOptions;
};

type ImportYnab5Modal = {
  name: 'import-ynab5';
  options: NoOptions;
};

type ImportActualModal = {
  name: 'import-actual';
  options: NoOptions;
};

type OutOfSyncMigrationsModal = {
  name: 'out-of-sync-migrations';
  options: NoOptions;
};

type FilesSettingsModal = {
  name: 'files-settings';
  options: NoOptions;
};

type ConfirmChangeDocumentDirModal = {
  name: 'confirm-change-document-dir';
  options: {
    currentBudgetDirectory: string;
    newDirectory: string;
  };
};

type CreateEncryptionKeyModal = {
  name: 'create-encryption-key';
  options: { recreate?: boolean };
};

type FixEncryptionKeyModalOptions = {
  name: 'fix-encryption-key';
  options: ComponentPropsWithoutRef<typeof FixEncryptionKeyModal>;
};

type EditFieldModal = {
  name: 'edit-field';
  options: {
    name: keyof Pick<TransactionEntity, 'date' | 'amount' | 'notes'>;
    onSubmit: (
      name: keyof Pick<TransactionEntity, 'date' | 'amount' | 'notes'>,
      value: string | number,
      mode?: 'prepend' | 'append' | 'replace' | null,
    ) => void;
    onClose?: () => void;
  };
};

type CategoryAutocompleteModal = {
  name: 'category-autocomplete';
  options: {
    categoryGroups?: CategoryGroupEntity[];
    onSelect: (categoryId: string, categoryName: string) => void;
    month?: string;
    showHiddenCategories?: boolean;
    onClose?: () => void;
  };
};

type AccountAutocompleteModal = {
  name: 'account-autocomplete';
  options: {
    onSelect: (accountId: string, accountName: string) => void;
    includeClosedAccounts?: boolean;
    onClose?: () => void;
  };
};

type PayeeAutocompleteModal = {
  name: 'payee-autocomplete';
  options: {
    onSelect: (payeeId: string) => void;
    onClose?: () => void;
  };
};

type BudgetSummaryModal = {
  name: 'budget-summary';
  options: {
    month: string;
  };
};

type ScheduleEditModal = {
  name: 'schedule-edit';
  options: { id: string; transaction?: TransactionEntity } | null;
};

type ScheduleLinkModal = {
  name: 'schedule-link';
  options: {
    transactionIds: string[];
    getTransaction: (
      transactionId: TransactionEntity['id'],
    ) => TransactionEntity;
    accountName?: string;
    onScheduleLinked?: (schedule: ScheduleEntity) => void;
  };
};

type SchedulesDiscoverModal = {
  name: 'schedules-discover';
  options: NoOptions;
};

type SchedulePostsOfflineNotificationModal = {
  name: 'schedule-posts-offline-notification';
  options: NoOptions;
};

type AccountMenuModal = {
  name: 'account-menu';
  options: {
    accountId: string;
    onSave: (account: AccountEntity) => void;
    onCloseAccount: (accountId: string) => void;
    onReopenAccount: (accountId: string) => void;
    onEditNotes: (id: string) => void;
    onClose?: () => void;
  };
};

type CategoryMenuModal = {
  name: 'category-menu';
  options: {
    categoryId: string;
    onSave: (category: CategoryEntity) => void;
    onEditNotes: (id: string) => void;
    onDelete: (categoryId: string) => void;
    onToggleVisibility: (categoryId: string) => void;
    onBudgetAction: (month: string, action: string, args?: unknown) => void;
    onClose?: () => void;
  };
};

type EnvelopeBudgetMenuModal = {
  name: 'envelope-budget-menu';
  options: {
    categoryId: string;
    month: string;
    onUpdateBudget: (amount: number) => void;
    onCopyLastMonthAverage: () => void;
    onSetMonthsAverage: (numberOfMonths: number) => void;
    onApplyBudgetTemplate: () => void;
  };
};

type TrackingBudgetMenuModal = {
  name: 'tracking-budget-menu';
  options: {
    categoryId: string;
    month: string;
    onUpdateBudget: (amount: number) => void;
    onCopyLastMonthAverage: () => void;
    onSetMonthsAverage: (numberOfMonths: number) => void;
    onApplyBudgetTemplate: () => void;
  };
};

type CategoryGroupMenuModal = {
  name: 'category-group-menu';
  options: {
    groupId: string;
    onSave: (group: CategoryGroupEntity) => void;
    onAddCategory: (groupId: string, isIncome: boolean) => void;
    onEditNotes: (id: string) => void;
    onDelete: (groupId: string) => void;
    onToggleVisibility: (groupId: string) => void;
    onClose?: () => void;
  };
};

type NotesModal = {
  name: 'notes';
  options: {
    id: string;
    name: string;
    onSave: (id: string, notes: string) => void;
  };
};

type TrackingBudgetSummaryModal = {
  name: 'tracking-budget-summary';
  options: { month: string };
};

type EnvelopeBudgetSummaryModal = {
  name: 'envelope-budget-summary';
  options: {
    month: string;
    onBudgetAction: (
      month: string,
      type: string,
      args: unknown,
    ) => Promise<void>;
  };
};

type NewCategoryGroupModal = {
  name: 'new-category-group';
  options: {
    onValidate?: (value: string) => string;
    onSubmit: (value: string) => Promise<void>;
  };
};

type NewCategoryModal = {
  name: 'new-category';
  options: {
    onValidate?: (value: string) => string;
    onSubmit: (value: string) => Promise<void>;
  };
};

type EnvelopeBalanceMenuModal = {
  name: 'envelope-balance-menu';
  options: {
    categoryId: string;
    month: string;
    onCarryover: (carryover: boolean) => void;
    onTransfer: () => void;
    onCover: () => void;
  };
};

type EnvelopeSummaryToBudgetMenuModal = {
  name: 'envelope-summary-to-budget-menu';
  options: {
    month: string;
    onTransfer: () => void;
    onCover: () => void;
    onHoldBuffer: () => void;
    onResetHoldBuffer: () => void;
  };
};

type TrackingBalanceMenuModal = {
  name: 'tracking-balance-menu';
  options: {
    categoryId: string;
    month: string;
    onCarryover: (carryover: boolean) => void;
  };
};

type TransferModal = {
  name: 'transfer';
  options: {
    title: string;
    categoryId?: CategoryEntity['id'];
    month: string;
    amount: number;
    onSubmit: (amount: number, toCategoryId: string) => void;
    showToBeBudgeted?: boolean;
  };
};

type CoverModal = {
  name: 'cover';
  options: {
    title: string;
    categoryId?: CategoryEntity['id'];
    month: string;
    showToBeBudgeted?: boolean;
    onSubmit: (fromCategoryId: string) => void;
  };
};

type HoldBufferModal = {
  name: 'hold-buffer';
  options: {
    month: string;
    onSubmit: (amount: number) => void;
  };
};

type ScheduledTransactionMenuModal = {
  name: 'scheduled-transaction-menu';
  options: {
    transactionId: string;
    onPost: (transactionId: string) => void;
    onSkip: (transactionId: string) => void;
  };
};

type BudgetPageMenuModal = {
  name: 'budget-page-menu';
  options: {
    onAddCategoryGroup: () => void;
    onToggleHiddenCategories: () => void;
    onSwitchBudgetFile: () => void;
  };
};

type EnvelopeBudgetMonthMenuModal = {
  name: 'envelope-budget-month-menu';
  options: {
    month: string;
    onBudgetAction: (month: string, action: string, arg?: unknown) => void;
    onEditNotes: (month: string) => void;
  };
};

type TrackingBudgetMonthMenuModal = {
  name: 'tracking-budget-month-menu';
  options: {
    month: string;
    onBudgetAction: (month: string, action: string, arg?: unknown) => void;
    onEditNotes: (month: string) => void;
  };
};

type BudgetListModal = {
  name: 'budget-list';
  options: NoOptions;
};

type ConfirmTransactionEditModal = {
  name: 'confirm-transaction-edit';
  options: {
    onConfirm: () => void;
    onCancel?: () => void;
    confirmReason: string;
  };
};

type ConfirmTransactionDeleteModal = {
  name: 'confirm-transaction-delete';
  options: {
    message?: string;
    onConfirm: () => void;
  };
};

type ConfirmUnlinkAccountModal = {
  name: 'confirm-unlink-account';
  options: {
    accountName: string;
    onUnlink: () => void;
  };
};

type KeyboardShortcutsModal = {
  name: 'keyboard-shortcuts';
  options: NoOptions;
};

type GoalTemplatesModal = {
  name: 'goal-templates';
  options: NoOptions;
};

export type Modal =
  | ImportTransactionsModal
  | AddAccountModal
  | AddLocalAccountModal
  | CloseAccountModal
  | SelectLinkedAccountsModal
  | ConfirmCategoryDeleteModal
  | LoadBackupModal
  | ManageRulesModal
  | EditRuleModal
  | MergeUnusedPayeesModal
  | GoCardlessInitModal
  | SimplefinInitModal
  | GoCardlessExternalMsgModal
  | DeleteBudgetModal
  | ImportModal
  | ImportYnab4Modal
  | ImportYnab5Modal
  | ImportActualModal
  | OutOfSyncMigrationsModal
  | FilesSettingsModal
  | ConfirmChangeDocumentDirModal
  | CreateEncryptionKeyModal
  | FixEncryptionKeyModalOptions
  | EditFieldModal
  | CategoryAutocompleteModal
  | AccountAutocompleteModal
  | PayeeAutocompleteModal
  | BudgetSummaryModal
  | ScheduleEditModal
  | ScheduleLinkModal
  | SchedulesDiscoverModal
  | SchedulePostsOfflineNotificationModal
  | AccountMenuModal
  | CategoryMenuModal
  | EnvelopeBudgetMenuModal
  | TrackingBudgetMenuModal
  | CategoryGroupMenuModal
  | NotesModal
  | TrackingBudgetSummaryModal
  | EnvelopeBudgetSummaryModal
  | NewCategoryGroupModal
  | NewCategoryModal
  | EnvelopeBalanceMenuModal
  | EnvelopeSummaryToBudgetMenuModal
  | TrackingBalanceMenuModal
  | TransferModal
  | CoverModal
  | HoldBufferModal
  | ScheduledTransactionMenuModal
  | BudgetPageMenuModal
  | EnvelopeBudgetMonthMenuModal
  | TrackingBudgetMonthMenuModal
  | BudgetListModal
  | ConfirmTransactionEditModal
  | ConfirmTransactionDeleteModal
  | ConfirmUnlinkAccountModal
  | KeyboardShortcutsModal
  | GoalTemplatesModal;

export type PushModalAction = {
  type: typeof constants.PUSH_MODAL;
  modal: Modal;
};

export type ReplaceModalAction = {
  type: typeof constants.REPLACE_MODAL;
  modal: Modal;
};

export type PopModalAction = {
  type: typeof constants.POP_MODAL;
};

export type CloseModalAction = {
  type: typeof constants.CLOSE_MODAL;
};

export type CollapseModalsAction = {
  type: typeof constants.COLLAPSE_MODALS;
  rootModalName: string;
};

export type ModalsActions =
  | PushModalAction
  | ReplaceModalAction
  | PopModalAction
  | CloseModalAction
  | CollapseModalsAction;

export function pushModal<M extends Modal['name']>(
  name: M,
  options?: Extract<Modal, { name: M }>['options'],
): PushModalAction {
  const modal: Modal = { name, options } as Modal;
  return { type: constants.PUSH_MODAL, modal };
}

export function replaceModal<M extends Modal['name']>(
  name: M,
  options?: Extract<Modal, { name: M }>['options'],
): ReplaceModalAction {
  const modal: Modal = { name, options } as Modal;
  return { type: constants.REPLACE_MODAL, modal };
}

export function popModal(): PopModalAction {
  return { type: constants.POP_MODAL };
}

export function closeModal(): CloseModalAction {
  return { type: constants.CLOSE_MODAL };
}

export function collapseModals(rootModalName: string) {
  return { type: constants.COLLAPSE_MODALS, rootModalName };
}