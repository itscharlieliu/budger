import { Action } from "redux";

export const SETTING_TOTAL_BUDGET = "SETTING_TOTAL_BUDGET";
export const SET_TOTAL_BUDGET_SUCCESS = "SET_TOTAL_BUDGET_SUCCESS";
export const SET_TOTAL_BUDGET_FAILURE = "SET_TOTAL_BUDGET_FAILURE";

export interface BudgetCategory {
    category: string;
    budgeted: number;
    activity: number;
}

export interface BudgetGroup {
    group: string;
    categories: BudgetCategory[];
}

export type TotalBudget = BudgetGroup[];

export interface BudgetState {
    totalBudget: TotalBudget;
    isSettingBudget: boolean;
    error: Error | null;
}

export interface SettingTotalBudgetAction extends Action<typeof SETTING_TOTAL_BUDGET> {}

export interface SetTotalBudgetSuccessAction extends Action<typeof SET_TOTAL_BUDGET_SUCCESS> {
    totalBudget: TotalBudget;
}

export interface SetTotalBudgetFailureAction extends Action<typeof SET_TOTAL_BUDGET_FAILURE> {
    error: Error;
}

export type GenericSetBudgetAction =
    | SettingTotalBudgetAction
    | SetTotalBudgetSuccessAction
    | SetTotalBudgetFailureAction;

export type GenericBudgetAction = GenericSetBudgetAction;
