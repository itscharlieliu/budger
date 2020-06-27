/* TODO Connect this to our back-end */
/* eslint-disable */

import { ThunkAction, ThunkDispatch } from "redux-thunk";

import ApplicationState from "../index";

import {
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
    GenericBudgetAction,
    GenericSetBudgetAction,
    GenericAddCategoryAction,
} from "./budgetInterfaces";

type GenericBudgetThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericBudgetAction>;

export const updateBudget = (
    date: Date,
    categoryGroup: string,
    category: string,
    budgeted: number,
    activity: number,
): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    // dispatch({ type: SETTING_TOTAL_BUDGET });
    //
    // // We store the budget with the format YYYY-mm
    // const formattedDate = `${date.getFullYear().toString()}-${date.getMonth().toString().padStart(2, "0")}`;
    //
    // const totalBudget = getState().budget.totalBudget;
    //
    // const category = totalBudget[formattedDate].findIndex(
    //     (budgetGroup: IBudgetGroup) => budgetGroup.name === categoryGroup,
    // );
    //
    // const newBudget: ITotalBudget = {
    //     ...getState().budget.totalBudget,
    //     [formattedDate]: {
    //         [category]: { budgeted, activity },
    //     },
    // };
    //
    // dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newBudget });
};

export const addCategory = (categoryName: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericAddCategoryAction>,
): Promise<void> => {
    console.log("adding: " + categoryName);
};
