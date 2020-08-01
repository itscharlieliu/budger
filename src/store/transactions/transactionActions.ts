import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { TRANSACTIONS } from "../../defs/storageKeys";
import { GenericBudgetAction } from "../budget/budgetInterfaces";
import ApplicationState from "../index";

import {
    GenericTransactionAction,
    Transaction,
    UPDATE_TRANSACTIONS_FAILURE,
    UPDATE_TRANSACTIONS_SUCCESS,
    UPDATING_TRANSACTIONS,
} from "./transactionInterfaces";

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

            // Save transaction to local storage
            localStorage.setItem(TRANSACTIONS, JSON.stringify(newTransactions));

            dispatch({ type: UPDATE_TRANSACTIONS_SUCCESS, transactions: newTransactions });
        } catch (error) {
            console.warn(error);
            dispatch({ type: UPDATE_TRANSACTIONS_FAILURE, error });
        }
    };
};

export const deleteTransaction = (index: number): GenericTransactionThunkAction => {
    return async (
        dispatch: ThunkDispatch<ApplicationState, null, GenericTransactionAction>,
        getState: () => ApplicationState,
    ): Promise<void> => {
        dispatch({ type: UPDATING_TRANSACTIONS });
        const transactions = getState().transaction.transactions;

        try {
            // update transactions
            const newTransactions: Transaction[] = [...transactions];

            newTransactions.splice(index, 1);

            // Save transaction to local storage
            localStorage.setItem(TRANSACTIONS, JSON.stringify(newTransactions));

            dispatch({ type: UPDATE_TRANSACTIONS_SUCCESS, transactions: newTransactions });
        } catch (error) {
            console.warn(error);
            dispatch({ type: UPDATE_TRANSACTIONS_FAILURE, error });
        }
    };
};
