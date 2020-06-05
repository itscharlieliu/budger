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
    totalBudget: BudgetGroup[];
    isSettingBudget: boolean;
    error: Error | null;
}

export interface SettingTotalBudgetAction extends Action<typeof SETTING_TOTAL_BUDGET> {}

export interface SetTotalBudgetActionSuccess extends Action<typeof SET_TOTAL_BUDGET_SUCCESS> {
    totalBudget: BudgetGroup[];
}

export interface SetTotalBudgetActionFailure extends Action<typeof SET_TOTAL_BUDGET_FAILURE> {
    error: Error;
}

export type GenericSetBudgetAction =
    | SettingTotalBudgetAction
    | SetTotalBudgetActionSuccess
    | SetTotalBudgetActionFailure;

export type GenericBudgetAction = GenericSetBudgetAction;
