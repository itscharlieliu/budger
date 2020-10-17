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
    GenericSetToBeBudgetedAction,
    SETTING_TO_BE_BUDGETED,
    SET_TO_BE_BUDGETED_SUCCESS,
} from "./budgetInterfaces";
import ERRORS from "../../defs/errors";
import { BUDGET, TO_BE_BUDGETED } from "../../defs/storageKeys";
import { getMonthCodeString, MonthCode } from "../../utils/getMonthCode";

type GenericBudgetThunkAction = ThunkAction<Promise<GenericBudgetAction>, ApplicationState, null, GenericBudgetAction>;

export const addBudgetMonth = (monthCode: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericAddMonthlyBudgetAction>,
    getState: () => ApplicationState,
): Promise<GenericAddMonthlyBudgetAction> => {
    dispatch({ type: ADDING_MONTHLY_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    if (totalBudget[monthCode]) {
        // Month already exists
        return dispatch({ type: ADD_MONTHLY_BUDGET_FAILURE, error: new Error(ERRORS.monthAlreadyExists) });
    }

    // Add empty budget
    // TODO create budget from template
    const newTotalBudget = { ...totalBudget, [monthCode]: {} };

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    return dispatch({ type: ADD_MONTHLY_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const addBudgetGroup = (monthCode: string, budgetGroup: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<GenericSetBudgetAction> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    if (totalBudget[monthCode] === undefined) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
    }

    if (totalBudget[monthCode][budgetGroup] !== undefined) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.groupAlreadyExists) });
    }

    const newMonthlyBudget = { ...totalBudget[monthCode], [budgetGroup]: {} };

    const newTotalBudget = { ...totalBudget, [monthCode]: newMonthlyBudget };

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    return dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const addBudgetCategory = (
    monthCode: MonthCode,
    budgetGroup: string,
    budgetCategory: string,
): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<GenericSetBudgetAction> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const monthCodeString = getMonthCodeString(monthCode);

    // Check if month exists
    if (!totalBudget[monthCodeString]) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
    }

    // Check if group exists
    if (!totalBudget[monthCodeString][budgetGroup]) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.groupDoesNotExist) });
    }

    // Check if category already exists in any group

    for (const group of Object.keys(totalBudget[monthCodeString])) {
        if (totalBudget[monthCodeString][group][budgetCategory] !== undefined) {
            return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryAlreadyExists) });
        }
    }

    const newBudgetGroup = {
        ...totalBudget[monthCodeString][budgetGroup],
        [budgetCategory]: {
            budgeted: 0,
            activity: 0,
        },
    };

    const newMonthlyBudget = { ...totalBudget[monthCodeString], [budgetGroup]: newBudgetGroup };

    const newTotalBudget = { ...totalBudget, [monthCodeString]: newMonthlyBudget };

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    return dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const deleteBudgetCategory = (monthcode: string, budgetCategory: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<GenericSetBudgetAction> => {
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
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryDoesNotExist) });
    }

    const newTotalBudget = { ...totalBudget, [monthcode]: newMonthlyBudget };

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    return dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const deleteBudgetGroup = (monthCode: MonthCode, budgetGroup: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<GenericSetBudgetAction> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newTotalBudget = { ...totalBudget };

    const monthCodeString = getMonthCodeString(monthCode);

    if (!newTotalBudget[monthCodeString]) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
    }

    if (!newTotalBudget[monthCodeString][budgetGroup]) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.groupDoesNotExist) });
    }

    delete newTotalBudget[monthCodeString][budgetGroup];

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    return dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const editBudgetedAmount = (
    monthCode: MonthCode,
    budgetCategory: string,
    budgeted: number,
): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<GenericSetBudgetAction> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newTotalBudget: TotalBudget = { ...totalBudget };

    const monthCodeString = getMonthCodeString(monthCode);

    if (!newTotalBudget[monthCodeString]) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
    }

    let numCategoriesEdited = 0;

    for (const group of Object.keys(newTotalBudget[monthCodeString])) {
        if (newTotalBudget[monthCodeString][group][budgetCategory] !== undefined) {
            newTotalBudget[monthCodeString][group][budgetCategory].budgeted = budgeted;
            ++numCategoriesEdited;
        }
    }

    if (numCategoriesEdited === 0) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryDoesNotExist) });
    }

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    return dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const setToBeBudgetedAmount = (
    toBeBudgeted: number | ((currToBeBudgeted: number) => number),
): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetToBeBudgetedAction>,
    getState: () => ApplicationState,
): Promise<GenericSetToBeBudgetedAction> => {
    dispatch({ type: SETTING_TO_BE_BUDGETED });

    let newToBeBudgeted = getState().budget.toBeBudgeted;

    if (typeof toBeBudgeted === "function") {
        newToBeBudgeted = toBeBudgeted(newToBeBudgeted);
    } else {
        newToBeBudgeted = toBeBudgeted;
    }

    localStorage.setItem(TO_BE_BUDGETED, JSON.stringify(newToBeBudgeted));

    return dispatch({ type: SET_TO_BE_BUDGETED_SUCCESS, toBeBudgeted: newToBeBudgeted });
};

export const setActivityAmount = (
    monthCode: string,
    budgetCategory: string,
    activity: number | ((currActivity: number) => number),
): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<GenericSetBudgetAction> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newTotalBudget: TotalBudget = { ...totalBudget };

    if (!newTotalBudget[monthCode]) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthDoesNotExist) });
    }

    let numCategoriesEdited = 0;

    for (const group of Object.keys(newTotalBudget[monthCode])) {
        if (newTotalBudget[monthCode][group][budgetCategory] !== undefined) {
            ++numCategoriesEdited;

            if (typeof activity === "function") {
                newTotalBudget[monthCode][group][budgetCategory].activity = activity(
                    newTotalBudget[monthCode][group][budgetCategory].activity,
                );
                continue;
            }
            newTotalBudget[monthCode][group][budgetCategory].activity = activity;
        }
    }

    if (numCategoriesEdited === 0) {
        return dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryDoesNotExist) });
    }

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    return dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};
