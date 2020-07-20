import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { BUDGET, TRANSACTIONS } from "../../defs/storageKeys";
import ApplicationState from "../index";

import {
    GenericInitializationAction,
    GenericSetBudgetInitializedAction,
    GenericSetTransactionInitializedAction,
    SET_BUDGET_INITIALIZED_FAILURE,
    SET_BUDGET_INITIALIZED_SUCCESS,
    SET_TRANSACTIONS_INITIALIZED_FAILURE,
    SET_TRANSACTIONS_INITIALIZED_SUCCESS,
    SET_TRANSLATION_INITIALIZED,
    SETTING_BUDGET_INITIALIZED,
    SETTING_TRANSACTIONS_INITIALIZED,
    SetTranslationInitializedAction,
} from "./initializationInterfaces";
import { TotalBudget } from "../budget/budgetInterfaces";
import validateTotalBudget from "../../utils/validateTotalBudget";
import ERRORS from "../../defs/errors";
import { GenericUpdateTransactionAction, Transaction } from "../transactions/transactionInterfaces";

type GenericInitializationThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericInitializationAction>;

export const setLanguageInitialized = (isInitialized: boolean): SetTranslationInitializedAction => ({
    type: SET_TRANSLATION_INITIALIZED,
    translationInitialized: isInitialized,
});

export const initBudget = (): GenericInitializationThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetBudgetInitializedAction>,
): Promise<void> => {
    dispatch({ type: SETTING_BUDGET_INITIALIZED });

    try {
        const totalBudgetJson = localStorage.getItem(BUDGET);
        const totalBudget: TotalBudget = totalBudgetJson ? JSON.parse(totalBudgetJson) : [];

        if (!validateTotalBudget(totalBudget)) {
            dispatch({ type: SET_BUDGET_INITIALIZED_FAILURE, error: new Error(ERRORS.invalidTotalBudget) });
            return;
        }

        dispatch({ type: SET_BUDGET_INITIALIZED_SUCCESS, totalBudget });
    } catch (error) {
        dispatch({ type: SET_BUDGET_INITIALIZED_FAILURE, error });
    }
};

export const initTransactions = (): GenericInitializationThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetTransactionInitializedAction>,
): Promise<void> => {
    dispatch({ type: SETTING_TRANSACTIONS_INITIALIZED });

    try {
        const totalTransactionsJson = localStorage.getItem(TRANSACTIONS);
        const transactions: Transaction[] = totalTransactionsJson ? JSON.parse(totalTransactionsJson) : [];

        // TODO Validate transactions
        // if (!validateTotalBudget(totalBudget)) {
        //     dispatch({ type: SET_TRANSACTIONS_INITIALIZED_FAILURE, error: new Error(ERRORS.invalidTotalBudget) });
        //     return;
        // }

        dispatch({ type: SET_TRANSACTIONS_INITIALIZED_SUCCESS, transactions });
    } catch (error) {
        dispatch({ type: SET_TRANSACTIONS_INITIALIZED_FAILURE, error });
    }
};
