import { Action } from "redux";

export const SETTING_TOTAL_BUDGET = "SETTING_TOTAL_BUDGET";
export const SET_TOTAL_BUDGET_SUCCESS = "SET_TOTAL_BUDGET_SUCCESS";
export const SET_TOTAL_BUDGET_FAILURE = "SET_TOTAL_BUDGET_FAILURE";

export const ADDING_CATEGORY = "ADDING_CATEGORY";
export const ADD_CATEGORY_SUCCESS = "ADD_CATEGORY_SUCCESS";
export const ADD_CATEGORY_FAILURE = "ADD_CATEGORY_FAILURE";

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
    isAddingCategory: boolean;
    error: Error | null;
}

export interface SettingTotalBudgetAction extends Action<typeof SETTING_TOTAL_BUDGET> {}

export interface SetTotalBudgetSuccessAction extends Action<typeof SET_TOTAL_BUDGET_SUCCESS> {
    totalBudget: BudgetGroup[];
}

export interface SetTotalBudgetFailureAction extends Action<typeof SET_TOTAL_BUDGET_FAILURE> {
    error: Error;
}

export interface AddingCategoryAction extends Action<typeof ADDING_CATEGORY> {}

export interface AddCategorySuccessAction extends Action<typeof ADD_CATEGORY_SUCCESS> {
    totalBudget: BudgetGroup[];
}

export interface AddCategoryFailureAction extends Action<typeof ADD_CATEGORY_FAILURE> {
    error: Error;
}

export type GenericSetBudgetAction =
    | SettingTotalBudgetAction
    | SetTotalBudgetSuccessAction
    | SetTotalBudgetFailureAction;

export type GenericAddCategoryAction = AddingCategoryAction | AddCategorySuccessAction | AddCategoryFailureAction;

export type GenericBudgetAction = GenericSetBudgetAction | GenericAddCategoryAction;
