import { ThunkAction, ThunkDispatch } from "redux-thunk";
import IApplicationState from "../index";
import { SET_TOTAL_BUDGET_SUCCESS, SETTING_TOTAL_BUDGET, TGenericBudgetAction } from "./budgetInterfaces";

type TGenericBudgetThunkAction = ThunkAction<Promise<void>, IApplicationState, null, TGenericBudgetAction>;

export const updateBudget = (
    date: Date,
    categoryGroup: string,
    category: string,
    budgeted?: number,
    activity?: number,
): TGenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<IApplicationState, null, TGenericBudgetAction>,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: {} });
};
