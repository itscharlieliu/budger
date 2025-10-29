import { Action } from "redux";

export const UPDATING_TRANSACTIONS = "UPDATING_TRANSACTIONS";
export const UPDATE_TRANSACTIONS_SUCCESS = "UPDATE_TRANSACTIONS_SUCCESS";
export const UPDATE_TRANSACTIONS_FAILURE = "UPDATE_TRANSACTIONS_FAILURE";

export interface Transaction {
    id?: string;
    account: string;
    date: Date;
    payee: string;
    category?: string;
    note?: string;
    activity: number;
}

export interface TransactionState {
    transactions: Transaction[];
    isUpdatingTransactions: boolean;
    error: Error | null;
}

export interface UpdatingTransactionAction extends Action<typeof UPDATING_TRANSACTIONS> {}

export interface UpdateTransactionSuccessAction extends Action<typeof UPDATE_TRANSACTIONS_SUCCESS> {
    transactions: Transaction[];
}

export interface UpdateTransactionFailureAction extends Action<typeof UPDATE_TRANSACTIONS_FAILURE> {
    error: Error;
}

export type GenericUpdateTransactionAction =
    | UpdatingTransactionAction
    | UpdateTransactionSuccessAction
    | UpdateTransactionFailureAction;

export type GenericTransactionAction = GenericUpdateTransactionAction;
