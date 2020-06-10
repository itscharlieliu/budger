import { Action } from "redux";

export const ADDING_TRANSACTION = "ADDING_TRANSACTION";
export const ADD_TRANSACTION_SUCCESS = "ADD_TRANSACTION_SUCCESS";
export const ADD_TRANSACTION_FAILURE = "ADD_TRANSACTION_FAILURE";

export interface Transaction {
    account: string;
    date: Date;
    payee: string;
    category: string;
    note?: string;
    activity: number;
}

export interface TransactionState {
    transactions: Transaction[];
    isAddingTransaction: boolean;
    error: Error | null;
}

export interface AddingTransactionAction extends Action<typeof ADDING_TRANSACTION> {}

export interface AddTransactionSuccessAction extends Action<typeof ADD_TRANSACTION_SUCCESS> {
    transactions: Transaction[];
}

export interface AddTransactionFailureAction extends Action<typeof ADD_TRANSACTION_FAILURE> {}

export type GenericAddTransactionAction =
    | AddingTransactionAction
    | AddTransactionSuccessAction
    | AddTransactionFailureAction;

export type GenericTransactionAction = GenericAddTransactionAction;
