import { Action } from "redux";
import { TotalBudget } from "../budget/budgetInterfaces";
import { Transaction } from "../transactions/transactionInterfaces";

export const SET_TRANSLATION_INITIALIZED = "SET_TRANSLATION_INITIALIZED";

export const SETTING_BUDGET_INITIALIZED = "SETTING_BUDGET_INITIALIZED";
export const SET_BUDGET_INITIALIZED_SUCCESS = "SET_BUDGET_INITIALIZED_SUCCESS";
export const SET_BUDGET_INITIALIZED_FAILURE = "SET_BUDGET_INITIALIZED_FAILURE";

export const SETTING_TRANSACTIONS_INITIALIZED = "SETTING_TRANSACTIONS_INITIALIZED";
export const SET_TRANSACTIONS_INITIALIZED_SUCCESS = "SET_TRANSACTIONS_INITIALIZED_SUCCESS";
export const SET_TRANSACTIONS_INITIALIZED_FAILURE = "SET_TRANSACTIONS_INITIALIZED_FAILURE";

export interface InitializationState {
    translationInitialized: boolean;
    budgetInitialized: boolean;
    transactionsInitialized: boolean;
    isSettingBudgetInitialized: boolean;
    isSettingTransactionsInitialized: boolean;
    error: Error | null;
}

export interface SetTranslationInitializedAction extends Action<typeof SET_TRANSLATION_INITIALIZED> {
    translationInitialized: boolean;
}

export interface SettingBudgetInitializedAction extends Action<typeof SETTING_BUDGET_INITIALIZED> {}

export interface SetBudgetInitializedSuccessAction extends Action<typeof SET_BUDGET_INITIALIZED_SUCCESS> {
    totalBudget: TotalBudget;
}

export interface SetBudgetInitializedFailureAction extends Action<typeof SET_BUDGET_INITIALIZED_FAILURE> {
    error: Error;
}

export type GenericSetBudgetInitializedAction =
    | SettingBudgetInitializedAction
    | SetBudgetInitializedSuccessAction
    | SetBudgetInitializedFailureAction;

export interface SettingTransactionsInitializedAction extends Action<typeof SETTING_TRANSACTIONS_INITIALIZED> {}

export interface SetTransactionsInitializedSuccessAction extends Action<typeof SET_TRANSACTIONS_INITIALIZED_SUCCESS> {
    transactions: Transaction[];
}

export interface SetTransactionInitializedFailureAction extends Action<typeof SET_TRANSACTIONS_INITIALIZED_FAILURE> {
    error: Error;
}

export type GenericSetTransactionInitializedAction =
    | SettingTransactionsInitializedAction
    | SetTransactionsInitializedSuccessAction
    | SetTransactionInitializedFailureAction;

export type GenericInitializationAction =
    | SetTranslationInitializedAction
    | GenericSetBudgetInitializedAction
    | GenericSetTransactionInitializedAction;
