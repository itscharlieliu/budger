import { Action } from "redux";

export const SETTING_TOTAL_BUDGET = "SETTING_TOTAL_BUDGET";
export const SET_TOTAL_BUDGET_SUCCESS = "SET_TOTAL_BUDGET_SUCCESS";
export const SET_TOTAL_BUDGET_FAILURE = "SET_TOTAL_BUDGET_FAILURE";

export const ADDING_CATEGORY_GROUP = "ADDING_CATEGORY_GROUP";
export const ADD_CATEGORY_GROUP_SUCCESS = "ADD_CATEGORY_GROUP_SUCCESS";
export const ADD_CATEGORY_GROUP_FAILURE = "ADD_CATEGORY_GROUP_FAILURE";

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
    isAddingCategoryGroup: boolean;
    error: Error | null;
}

export interface SettingTotalBudgetAction extends Action<typeof SETTING_TOTAL_BUDGET> {}

export interface SetTotalBudgetSuccessAction extends Action<typeof SET_TOTAL_BUDGET_SUCCESS> {
    totalBudget: BudgetGroup[];
}

export interface SetTotalBudgetFailureAction extends Action<typeof SET_TOTAL_BUDGET_FAILURE> {
    error: Error;
}

export interface AddingCategoryGroupAction extends Action<typeof ADDING_CATEGORY_GROUP> {}

export interface AddCategoryGroupSuccessAction extends Action<typeof ADD_CATEGORY_GROUP_SUCCESS> {
    totalBudget: BudgetGroup[];
}

export interface AddCategoryGroupFailureAction extends Action<typeof ADD_CATEGORY_GROUP_FAILURE> {
    error: Error;
}

export type GenericSetBudgetAction =
    | SettingTotalBudgetAction
    | SetTotalBudgetSuccessAction
    | SetTotalBudgetFailureAction;

export type GenericAddCategoryGroupAction =
    | AddingCategoryGroupAction
    | AddCategoryGroupSuccessAction
    | AddCategoryGroupFailureAction;

export type GenericBudgetAction = GenericSetBudgetAction | GenericAddCategoryGroupAction;
