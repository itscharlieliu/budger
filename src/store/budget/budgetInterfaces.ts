import { Action } from "redux";

export const SETTING_TOTAL_BUDGET = "SETTING_TOTAL_BUDGET";
export const SET_TOTAL_BUDGET_SUCCESS = "SET_TOTAL_BUDGET_SUCCESS";
export const SET_TOTAL_BUDGET_FAILURE = "SET_TOTAL_BUDGET_FAILURE";

export interface IBudgetCategory {
    budgeted: number;
    activity: number;
}

export interface IMonthlyBudget {
    [budgetGroup: string]: IBudgetCategory;
}

export interface ITotalBudget {
    [monthsSinceEpoch: number]: IMonthlyBudget;
}

export interface IBudgetState {
    totalBudget: ITotalBudget;
    isSettingBudget: boolean;
    error: Error | null;
}

export interface ISettingTotalBudgetAction extends Action<typeof SETTING_TOTAL_BUDGET> {}

export interface ISetTotalBudgetActionSuccess extends Action<typeof SET_TOTAL_BUDGET_SUCCESS> {
    totalBudget: ITotalBudget;
}

export interface ISetTotalBudgetActionFailure extends Action<typeof SET_TOTAL_BUDGET_FAILURE> {
    error: Error;
}

export type TGenericSetBudgetAction =
    | ISettingTotalBudgetAction
    | ISetTotalBudgetActionSuccess
    | ISetTotalBudgetActionFailure;

export type TGenericBudgetAction = TGenericSetBudgetAction;
