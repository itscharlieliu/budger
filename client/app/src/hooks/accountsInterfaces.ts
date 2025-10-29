import { Action } from "redux";

export const SET_CACHED_BALANCE_SUCCESS = "SET_CACHED_BALANCE_SUCCESS";
export const SET_CACHED_BALANCE_FAILURE = "SET_CACHED_BALANCE_FAILURE";

export const UPDATING_ACCOUNT = "UPDATING_ACCOUNT";
export const UPDATE_ACCOUNT_SUCCESS = "UPDATE_ACCOUNT_SUCCESS";
export const UPDATE_ACCOUNT_FAILURE = "UPDATE_ACCOUNT_FAILURE";

export enum AccountType {
    budgeted,
    unbudgeted,
}

export interface BankAccount {
    name: string;
    type: AccountType;
    cachedBalance: number;
}

export type AllAccounts = BankAccount[];

export interface AccountsState {
    allAccounts: AllAccounts;
    isAddingAccount: boolean;
    error: Error | null;
}

export interface SetCachedBalanceSuccessAction extends Action<typeof SET_CACHED_BALANCE_SUCCESS> {
    allAccounts: AllAccounts;
}

export interface SetCachedBalanceFailureAction extends Action<typeof SET_CACHED_BALANCE_FAILURE> {
    error: Error;
}

export type GenericSetCachedBalanceAction = SetCachedBalanceSuccessAction | SetCachedBalanceFailureAction;

export interface UpdateAccountAction extends Action<typeof UPDATING_ACCOUNT> {}

export interface UpdateAccountSuccessAction extends Action<typeof UPDATE_ACCOUNT_SUCCESS> {
    allAccounts: AllAccounts;
}

export interface UpdateAccountFailureAction extends Action<typeof UPDATE_ACCOUNT_FAILURE> {
    error: Error;
}

export type GenericUpdateAccountAction = UpdateAccountAction | UpdateAccountSuccessAction | UpdateAccountFailureAction;

export type GenericAccountsAction = GenericUpdateAccountAction | GenericSetCachedBalanceAction;
