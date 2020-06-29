/* TODO Connect this to our back-end */
/* eslint-disable */

import { ThunkAction, ThunkDispatch } from "redux-thunk";

import ApplicationState from "../index";

import {
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
    GenericBudgetAction,
    GenericSetBudgetAction,
    GenericAddBudgetGroupAction,
    ADDING_BUDGET_GROUP,
    BudgetGroup,
    ADD_BUDGET_GROUP_SUCCESS,
    ADD_BUDGET_GROUP_FAILURE,
} from "./budgetInterfaces";
import ERRORS from "../../defs/errors";

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

export const addBudgetGroup = (budgetGroup: string): GenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericAddBudgetGroupAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: ADDING_BUDGET_GROUP });

    const totalBudget = getState().budget.totalBudget;

    if (totalBudget.some((group: BudgetGroup) => group.group === budgetGroup)) {
        dispatch({ type: ADD_BUDGET_GROUP_FAILURE, error: new Error(ERRORS.groupAlreadyExists) });
        return;
    }

    const newBudgetGroup: BudgetGroup = { group: budgetGroup, categories: [] };

    const newTotalBudget = [newBudgetGroup, ...totalBudget];

    dispatch({ type: ADD_BUDGET_GROUP_SUCCESS, totalBudget: newTotalBudget });
};
