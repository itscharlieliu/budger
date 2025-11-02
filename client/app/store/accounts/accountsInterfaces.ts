export const SET_CACHED_BALANCE_SUCCESS = "SET_CACHED_BALANCE_SUCCESS";
export const SET_CACHED_BALANCE_FAILURE = "SET_CACHED_BALANCE_FAILURE";

export const UPDATING_ACCOUNT = "UPDATING_ACCOUNT";
export const UPDATE_ACCOUNT_SUCCESS = "UPDATE_ACCOUNT_SUCCESS";
export const UPDATE_ACCOUNT_FAILURE = "UPDATE_ACCOUNT_FAILURE";

export interface BankAccount {
    id?: number; // Server ID
    name: string;
    cachedBalance: number;
    accountType?: string; // Server account type (checking, savings, etc.) TODO Sync types with server
}

export type AllAccounts = BankAccount[];

export interface AccountsState {
    allAccounts: AllAccounts;
    isAddingAccount: boolean;
    error: Error | null;
}
