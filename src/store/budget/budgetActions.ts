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

export const addBudgetGroup = (budgetGroup: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    if (totalBudget.some((group: BudgetGroup) => group.group === budgetGroup)) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.groupAlreadyExists) });
        return;
    }

    const newBudgetGroup: BudgetGroup = { group: budgetGroup, categories: [] };

    const newTotalBudget = [newBudgetGroup, ...totalBudget];

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};

export const addBudgetCategory = (budgetGroup: string, budgetCategory: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    const totalBudget = getState().budget.totalBudget;

    const groupIndex = totalBudget.findIndex((value: BudgetGroup) => value.group === budgetGroup);

    // Check if group exists
    if (groupIndex === -1) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.groupDoesNotExist) });
        return;
    }

    // TODO Check if category exists in any group
    // Check if category already exists in the group
    if (totalBudget[groupIndex].categories.some((value: BudgetCategory) => value.category === budgetCategory)) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryAlreadyExists) });
        return;
    }

    // Add new category to total budget
    const newBudgetCategory: BudgetCategory = { category: budgetCategory, budgeted: 0 };
    const newTotalBudget = [...totalBudget];
    newTotalBudget[groupIndex].categories = [newBudgetCategory, ...newTotalBudget[groupIndex].categories];

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
