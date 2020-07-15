import { Action } from "redux";
import { TotalBudget } from "../budget/budgetInterfaces";

export const SET_TRANSLATION_INITIALIZED = "SET_TRANSLATION_INITIALIZED";

export const SETTING_BUDGET_INITIALIZED = "SETTING_BUDGET_INITIALIZED";
export const SET_BUDGET_INITIALIZED_SUCCESS = "SET_BUDGET_INITIALIZED_SUCCESS";
export const SET_BUDGET_INITIALIZED_FAILURE = "SET_BUDGET_INITIALIZED_FAILURE";

export interface InitializationState {
    translationInitialized: boolean;
    budgetInitialized: boolean;
    isSettingBudgetInitialized: boolean;
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

export type GenericInitializationAction = SetTranslationInitializedAction | GenericSetBudgetInitializedAction;
