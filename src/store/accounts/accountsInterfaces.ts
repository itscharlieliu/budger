import { Action } from "redux";

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
    // balance: number; // This should be derived from transactions
}

export type AllAccounts = BankAccount[];

export interface AccountsState {
    allAccounts: AllAccounts;
    isAddingAccount: boolean;
    error: Error | null;
}

export interface AddingAccountAction extends Action<typeof ADDING_ACCOUNT> {}

export interface AddAccountSuccessAction extends Action<typeof ADD_ACCOUNT_SUCCESS> {
    allAccounts: AllAccounts;
}

export interface AddAccountFailureAction extends Action<typeof ADD_ACCOUNT_FAILURE> {
    error: Error;
}

export type GenericAddAccountAction = AddingAccountAction | AddAccountSuccessAction | AddAccountFailureAction;

export type GenericAccountsAction = GenericAddAccountAction;
