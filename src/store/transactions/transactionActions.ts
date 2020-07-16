import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { GenericBudgetAction } from "../budget/budgetInterfaces";
import ApplicationState from "../index";

import {
    GenericTransactionAction,
    Transaction,
    UPDATE_TRANSACTIONS_FAILURE,
    UPDATE_TRANSACTIONS_SUCCESS,
    UPDATING_TRANSACTIONS,
} from "./transactionInterfaces";
import { BUDGET, TRANSACTIONS } from "../../defs/storageKeys";

export type GenericTransactionThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericBudgetAction>;

export const addTransaction = (
    payee: string,
    account: string,
    category: string,
    date: Date,
    activity: number,
    note?: string,
): GenericTransactionThunkAction => {
    return async (
        dispatch: ThunkDispatch<ApplicationState, null, GenericTransactionAction>,
        getState: () => ApplicationState,
    ): Promise<void> => {
        dispatch({ type: UPDATING_TRANSACTIONS });
        const transactions = getState().transaction.transactions;

        try {
            // update transactions
            const newTransactions: Transaction[] = [
                ...transactions,
                {
                    account,
                    date,
                    payee,
                    category,
                    note,
                    activity,
                },
            ];

            // Save budget to local storage
            localStorage.setItem(TRANSACTIONS, JSON.stringify(newTransactions));

            dispatch({ type: UPDATE_TRANSACTIONS_SUCCESS, transactions: newTransactions });
        } catch (error) {
            console.warn(error);
            dispatch({ type: UPDATE_TRANSACTIONS_FAILURE, error });
        }
    };
};
