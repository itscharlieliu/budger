import { Action } from "redux";

export const SETTING_TOTAL_BUDGET = "SETTING_TOTAL_BUDGET";
export const SET_TOTAL_BUDGET_SUCCESS = "SET_TOTAL_BUDGET_SUCCESS";
export const SET_TOTAL_BUDGET_FAILURE = "SET_TOTAL_BUDGET_FAILURE";

export const ADDING_BUDGET_GROUP = "ADDING_BUDGET_GROUP";
export const ADD_BUDGET_GROUP_SUCCESS = "ADD_BUDGET_GROUP_SUCCESS";
export const ADD_BUDGET_GROUP_FAILURE = "ADD_BUDGET_GROUP_FAILURE";

export const ADDING_BUDGET_CATEGORY = "ADDING_BUDGET_CATEGORY";
export const ADD_BUDGET_CATEGORY_SUCCESS = "ADD_BUDGET_CATEGORY_SUCCESS";
export const ADD_BUDGET_CATEGORY_FAILURE = "ADD_BUDGET_CATEGORY_FAILURE";

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
    isAddingBudgetGroup: boolean;
    isAddingBudgetCategory: boolean;
    error: Error | null;
}

export interface SettingTotalBudgetAction extends Action<typeof SETTING_TOTAL_BUDGET> {}

export interface SetTotalBudgetSuccessAction extends Action<typeof SET_TOTAL_BUDGET_SUCCESS> {
    totalBudget: TotalBudget;
}

export interface SetTotalBudgetFailureAction extends Action<typeof SET_TOTAL_BUDGET_FAILURE> {
    error: Error;
}

export interface AddingBudgetGroupAction extends Action<typeof ADDING_BUDGET_GROUP> {}

export interface AddBudgetGroupSuccessAction extends Action<typeof ADD_BUDGET_GROUP_SUCCESS> {
    totalBudget: TotalBudget;
}

export interface AddBudgetGroupFailureAction extends Action<typeof ADD_BUDGET_GROUP_FAILURE> {
    error: Error;
}

export interface AddingBudgetCategoryAction extends Action<typeof ADDING_BUDGET_CATEGORY> {}

export interface AddBudgetCategorySuccessAction extends Action<typeof ADD_BUDGET_CATEGORY_SUCCESS> {
    totalBudget: TotalBudget;
}

export interface AddBudgetCategoryFailureAction extends Action<typeof ADD_BUDGET_CATEGORY_FAILURE> {
    error: Error;
}

export type GenericSetBudgetAction =
    | SettingTotalBudgetAction
    | SetTotalBudgetSuccessAction
    | SetTotalBudgetFailureAction;

export type GenericAddBudgetGroupAction =
    | AddingBudgetGroupAction
    | AddBudgetGroupSuccessAction
    | AddBudgetGroupFailureAction;

export type GenericAddBudgetCategoryAction =
    | AddingBudgetCategoryAction
    | AddBudgetCategorySuccessAction
    | AddBudgetCategoryFailureAction;

export type GenericBudgetAction = GenericSetBudgetAction | GenericAddBudgetGroupAction | GenericAddBudgetCategoryAction;
