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

    // Check if category already exists in the group
    if (totalBudget[groupIndex].categories.some((value: BudgetCategory) => value.category === budgetCategory)) {
        dispatch({ type: SET_TOTAL_BUDGET_FAILURE, error: new Error(ERRORS.categoryAlreadyExists) });
        return;
    }

    // Add new category to total budget
    const newBudgetCategory: BudgetCategory = { category: budgetCategory, activity: 0, budgeted: 0 };
    const newTotalBudget = [...totalBudget];
    newTotalBudget[groupIndex].categories = [newBudgetCategory, ...newTotalBudget[groupIndex].categories];

    // Save budget to local storage
    localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newTotalBudget });
};
