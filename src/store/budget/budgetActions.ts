/* TODO Connect this to our back-end */
/* eslint-disable */

import { ThunkAction, ThunkDispatch } from "redux-thunk";

import IApplicationState from "../index";

import { SET_TOTAL_BUDGET_SUCCESS, SETTING_TOTAL_BUDGET, TGenericBudgetAction } from "./budgetInterfaces";

type TGenericBudgetThunkAction = ThunkAction<Promise<void>, IApplicationState, null, TGenericBudgetAction>;

export const updateBudget = (
    date: Date,
    categoryGroup: string,
    category: string,
    budgeted: number,
    activity: number,
): TGenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<IApplicationState, null, TGenericBudgetAction>,
    getState: () => IApplicationState,
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
