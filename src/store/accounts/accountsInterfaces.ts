import { Action } from "redux";

export const SET_CACHED_BALANCE_SUCCESS = "SET_CACHED_BALANCE_SUCCESS";
export const SET_CACHED_BALANCE_FAILURE = "SET_CACHED_BALANCE_FAILURE";

export const ADDING_ACCOUNT = "ADDING_ACCOUNT";
export const ADD_ACCOUNT_SUCCESS = "ADD_ACCOUNT_SUCCESS";
export const ADD_ACCOUNT_FAILURE = "ADD_ACCOUNT_FAILURE";

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

export interface AddingAccountAction extends Action<typeof ADDING_ACCOUNT> {}

export interface AddAccountSuccessAction extends Action<typeof ADD_ACCOUNT_SUCCESS> {
    allAccounts: AllAccounts;
}

export interface AddAccountFailureAction extends Action<typeof ADD_ACCOUNT_FAILURE> {
    error: Error;
}

export type GenericAddAccountAction = AddingAccountAction | AddAccountSuccessAction | AddAccountFailureAction;

export type GenericAccountsAction = GenericAddAccountAction | GenericSetCachedBalanceAction;
