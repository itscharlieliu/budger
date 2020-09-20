/* TODO Connect this to our back-end */
/* eslint-disable */

import { ThunkAction, ThunkDispatch } from "redux-thunk";

import ApplicationState from "../index";

import {
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
    GenericBudgetAction,
    GenericSetBudgetAction,
    BudgetGroup,
    BudgetCategory,
    SET_TOTAL_BUDGET_FAILURE,
    TotalBudget,
    MonthlyBudget,
    ADDING_MONTHLY_BUDGET,
    GenericAddMonthlyBudgetAction,
    ADD_MONTHLY_BUDGET_FAILURE,
    ADD_MONTHLY_BUDGET_SUCCESS,
} from "./budgetInterfaces";
import ERRORS from "../../defs/errors";
import { BUDGET } from "../../defs/storageKeys";

type GenericBudgetThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericBudgetAction>;

export const addBudgetMonth = (monthCode: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericAddMonthlyBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: ADDING_MONTHLY_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    if (totalBudget[monthCode]) {
        // Month already exists
        dispatch({ type: ADD_MONTHLY_BUDGET_FAILURE, error: new Error(ERRORS.monthAlreadyExists) });
        return;
    }

    // Add empty budget
    // TODO create budget from template
    const newTotalBudget = { ...totalBudget, [monthCode]: {} };

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: ADD_MONTHLY_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const addBudgetGroup = (monthCode: string, budgetGroup: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    if (totalBudget[monthCode] === undefined) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
        return;
    }

    if (totalBudget[monthCode][budgetGroup] !== undefined) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.groupAlreadyExists) });
        return;
    }

    const newMonthlyBudget = { ...totalBudget[monthCode], [budgetGroup]: {} };

    const newTotalBudget = { ...totalBudget, [monthCode]: newMonthlyBudget };

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const addBudgetCategory = (
    monthCode: string,
    budgetGroup: string,
    budgetCategory: string,
): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    // Check if month exists
    if (!totalBudget[monthCode]) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
        return;
    }

    // Check if group exists
    if (!totalBudget[monthCode][budgetGroup]) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.groupDoesNotExist) });
        return;
    }

    // Check if category already exists in any group

    for (const group of Object.keys(totalBudget[monthCode])) {
        if (totalBudget[monthCode][group][budgetCategory] !== undefined) {
            dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryAlreadyExists) });
            return;
        }
    }

    const newBudgetGroup = {
        ...totalBudget[monthCode][budgetGroup],
        [budgetCategory]: {
            budgeted: 0,
            activity: 0,
        },
    };

    const newMonthlyBudget = { ...totalBudget[monthCode], [budgetGroup]: newBudgetGroup };

    const newTotalBudget = { ...totalBudget, [monthCode]: newMonthlyBudget };

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const deleteBudgetCategory = (monthcode: string, budgetCategory: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newMonthlyBudget: MonthlyBudget = { ...totalBudget[monthcode] };

    let numCategoriesDeleted = 0;

    for (const group of Object.keys(newMonthlyBudget)) {
        if (newMonthlyBudget[group][budgetCategory] !== undefined) {
            delete newMonthlyBudget[group][budgetCategory];
            ++numCategoriesDeleted;
        }
    }

    if (numCategoriesDeleted === 0) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryDoesNotExist) });
        return;
    }

    const newTotalBudget = { ...totalBudget, [monthcode]: newMonthlyBudget };

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const deleteBudgetGroup = (monthCode: string, budgetGroup: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newTotalBudget = { ...totalBudget };

    if (!newTotalBudget[monthCode]) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
        return;
    }

    if (!newTotalBudget[monthCode][budgetGroup]) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.groupDoesNotExist) });
        return;
    }

    delete newTotalBudget[monthCode][budgetGroup];

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const editBudgetedAmount = (
    monthCode: string,
    budgetCategory: string,
    budgeted: number,
): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newTotalBudget: TotalBudget = { ...totalBudget };

    if (!newTotalBudget[monthCode]) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
        return;
    }

    let numCategoriesEdited = 0;

    for (const group of Object.keys(newTotalBudget[monthCode])) {
        if (newTotalBudget[monthCode][group][budgetCategory] !== undefined) {
            newTotalBudget[monthCode][group][budgetCategory].budgeted = budgeted;
            ++numCategoriesEdited;
        }
    }

    if (numCategoriesEdited === 0) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryDoesNotExist) });
        return;
    }

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const editActivityAmount = (
    monthCode: string,
    budgetCategory: string,
    activity: number,
): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newTotalBudget: TotalBudget = { ...totalBudget };

    if (!newTotalBudget[monthCode]) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
        return;
    }

    let numCategoriesEdited = 0;

    for (const group of Object.keys(newTotalBudget[monthCode])) {
        if (newTotalBudget[monthCode][group][budgetCategory] !== undefined) {
            newTotalBudget[monthCode][group][budgetCategory].budgeted = budgeted;
            ++numCategoriesEdited;
        }
    }

    if (numCategoriesEdited === 0) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryDoesNotExist) });
        return;
    }

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};
