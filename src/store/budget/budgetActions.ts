import { ThunkAction, ThunkDispatch } from "redux-thunk";

import IApplicationState from "../index";

import { ITotalBudget, SET_TOTAL_BUDGET_SUCCESS, SETTING_TOTAL_BUDGET, TGenericBudgetAction } from "./budgetInterfaces";

type TGenericBudgetThunkAction = ThunkAction<Promise<void>, IApplicationState, null, TGenericBudgetAction>;

export const updateBudget = (
    date: Date,
    categoryGroup: string,
    category: string,
    budgeted?: number,
    activity?: number,
): TGenericBudgetThunkAction => async (
    dispatch: ThunkDispatch<IApplicationState, null, TGenericBudgetAction>,
    getState: () => IApplicationState,
): Promise<void> => {
    dispatch({ type: SETTING_TOTAL_BUDGET });

    console.log(date.getMonth());

    // We store the budget with the format YYYY-mm
    const formattedDate = `${date.getFullYear().toString()}-${date.getMonth().toString().padStart(2, "0")}`;

    const newBudget: ITotalBudget = {
        ...getState().budget.totalBudget,
        [formattedDate]: {
            test: { budgeted: 1, activity: 2 },
        },
    };

    dispatch({ type: SET_TOTAL_BUDGET_SUCCESS, totalBudget: newBudget });
};
