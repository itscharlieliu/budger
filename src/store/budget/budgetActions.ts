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
} from "./budgetInterfaces";
import ERRORS from "../../defs/errors";
import { BUDGET } from "../../defs/storageKeys";

type GenericBudgetThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericBudgetAction>;

export const addBudgetMonth = (monthCode: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    if (totalBudget[monthCode]) {
        // Month already exists
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.monthAlreadyExists) });
        return;
    }

    // Add empty budget
    // TODO create budget from template
    const newTotalBudget = { ...totalBudget, [monthCode]: {} };
    // totalBudget[monthCode] = {};

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const addBudgetGroup = (budgetGroup: string, monthCode: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    if (!totalBudget[monthCode]) {
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
    if (totalBudget[monthCode][budgetGroup][budgetCategory] !== undefined) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryAlreadyExists) });
        return;
    }

    // Add new category to total budget
    // const newBudgetCategory: BudgetCategory = { category: budgetCategory, budgeted: 0 };
    // const newTotalBudget = [...totalBudget];
    // newTotalBudget[groupIndex].categories = [...newTotalBudget[groupIndex].categories, newBudgetCategory];

    // const newBudgetGroup = { ...totalBudget[budgetGroup], [budgetCategory]: { budgeted: 0 } };
    // const newTotalBudget = { ...totalBudget, [monthCode]: newBudgetGroup };

    const newBudgetGroup = {
        ...totalBudget[monthCode][budgetGroup],
        [budgetCategory]: {
            budgeted: 0,
        },
    };

    const newMonthlyBudget = { ...totalBudget[monthCode], [budgetGroup]: newBudgetGroup };

    const newTotalBudget = { ...totalBudget, [monthCode]: newMonthlyBudget };

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const deleteBudgetCategory = (budgetCategory: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newTotalBudget: TotalBudget = [];

    let numCategoriesDeleted = 0;

    // Generate new total budget
    for (const group of totalBudget) {
        // Push empty group with same name
        newTotalBudget.push({ group: group.group, categories: [] });
        for (const category of group.categories) {
            if (category.category === budgetCategory) {
                ++numCategoriesDeleted;
                continue;
            }
            // Push remaining categories to group
            newTotalBudget[newTotalBudget.length - 1].categories.push(category);
        }
    }

    if (numCategoriesDeleted === 0) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryDoesNotExist) });
        return;
    }

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const deleteBudgetGroup = (budgetGroup: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newTotalBudget: TotalBudget = [];

    // Generate new total budget
    for (const group of totalBudget) {
        if (group.group === budgetGroup) {
            continue;
        }
        newTotalBudget.push(group);
    }

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const editBudgetedAmount = (budgetCategory: string, budgeted: number): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const newTotalBudget: TotalBudget = [];

    // Generate new total budget
    for (const group of totalBudget) {
        // Push empty group with same name
        newTotalBudget.push({ group: group.group, categories: [] });
        for (const category of group.categories) {
            if (category.category === budgetCategory) {
                category.budgeted = budgeted;
            }
            newTotalBudget[newTotalBudget.length - 1].categories.push(category);
        }
    }

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};
