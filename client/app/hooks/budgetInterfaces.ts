import { Action } from "redux";

export const SETTING_TOTAL_BUDGET = "SETTING_TOTAL_BUDGET";
export const SET_TOTAL_BUDGET_SUCCESS = "SET_TOTAL_BUDGET_SUCCESS";
export const SET_TOTAL_BUDGET_FAILURE = "SET_TOTAL_BUDGET_FAILURE";

export const ADDING_MONTHLY_BUDGET = "ADDING_MONTHLY_BUDGET";
export const ADD_MONTHLY_BUDGET_SUCCESS = "ADD_MONTHLY_BUDGET_SUCCESS";
export const ADD_MONTHLY_BUDGET_FAILURE = "ADD_MONTHLY_BUDGET_FAILURE";

export const SETTING_TO_BE_BUDGETED = "SETTING_TO_BE_BUDGETED";
export const SET_TO_BE_BUDGETED_SUCCESS = "SET_TO_BE_BUDGETED_SUCCESS";
export const SET_TO_BE_BUDGETED_FAILURE = "SET_TO_BE_BUDGETED_FAILURE";

export interface BudgetCategory {
    budgeted: number;
    activity: number;
}

export interface BudgetGroup {
    [category: string]: BudgetCategory;
}

export interface MonthlyBudget {
    [group: string]: BudgetGroup;
}

export interface TotalBudget {
    [month: string]: MonthlyBudget;
}

export interface BudgetState {
    totalBudget: TotalBudget;
    toBeBudgeted: number;
    isSettingBudget: boolean;
    isAddingMonthlyBudget: boolean;
    error: Error | null;
}

export interface SettingTotalBudgetAction extends Action<typeof SETTING_TOTAL_BUDGET> {}

export interface SetTotalBudgetSuccessAction extends Action<typeof SET_TOTAL_BUDGET_SUCCESS> {
    totalBudget: TotalBudget;
}

export interface SetTotalBudgetFailureAction extends Action<typeof SET_TOTAL_BUDGET_FAILURE> {
    error: Error;
}

export interface AddingMonthlyBudgetAction extends Action<typeof ADDING_MONTHLY_BUDGET> {}

export interface AddMonthlyBudgetSuccessAction extends Action<typeof ADD_MONTHLY_BUDGET_SUCCESS> {
    totalBudget: TotalBudget;
}

export interface AddMonthlyBudgetFailureAction extends Action<typeof ADD_MONTHLY_BUDGET_FAILURE> {
    error: Error;
}

export interface SettingToBeBudgetedAction extends Action<typeof SETTING_TO_BE_BUDGETED> {}

export interface SetToBeBudgetedSuccessAction extends Action<typeof SET_TO_BE_BUDGETED_SUCCESS> {
    toBeBudgeted: number;
}

export interface SetToBeBudgetedFailureAction extends Action<typeof SET_TO_BE_BUDGETED_FAILURE> {
    error: Error;
}

export type GenericSetBudgetAction =
    | SettingTotalBudgetAction
    | SetTotalBudgetSuccessAction
    | SetTotalBudgetFailureAction;

export type GenericAddMonthlyBudgetAction =
    | AddingMonthlyBudgetAction
    | AddMonthlyBudgetSuccessAction
    | AddMonthlyBudgetFailureAction;

export type GenericSetToBeBudgetedAction =
    | SettingToBeBudgetedAction
    | SetToBeBudgetedSuccessAction
    | SetToBeBudgetedFailureAction;

export type GenericBudgetAction = GenericSetBudgetAction | GenericAddMonthlyBudgetAction | GenericSetToBeBudgetedAction;
