import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { TRANSACTIONS } from "../../defs/storageKeys";
import { setBalance } from "../accounts/accountsActions";
import { setActivityAmount, setToBeBudgetedAmount } from "../budget/budgetActions";
import { GenericBudgetAction } from "../budget/budgetInterfaces";
import ApplicationState from "../index";

import {
    GenericTransactionAction,
    Transaction,
    UPDATE_TRANSACTIONS_FAILURE,
    UPDATE_TRANSACTIONS_SUCCESS,
    UPDATING_TRANSACTIONS,
} from "./transactionInterfaces";
import { getMonthCodeFromDate, getMonthCodeString, MonthCode } from "../../utils/getMonthCode";

export type GenericTransactionThunkAction = ThunkAction<
    Promise<GenericTransactionAction>,
    ApplicationState,
    null,
    GenericBudgetAction
>;

export const addTransaction = (
    payee: string,
    account: string,
    date: Date,
    activity: number,
    category?: string,
    note?: string,
): GenericTransactionThunkAction => {
    return async (
        dispatch: ThunkDispatch<ApplicationState, null, GenericTransactionAction>,
        getState: () => ApplicationState,
    ): Promise<GenericTransactionAction> => {
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

            // Update budget activity
            const monthCode: MonthCode = getMonthCodeFromDate(date);

            let updateBudgetResult;

            // If we don't have a category, then just add the activity to our To-Be budgeted pool
            if (!category) {
                updateBudgetResult = await dispatch(
                    setToBeBudgetedAmount((currActivity: number) => currActivity + activity),
                );
            } else {
                updateBudgetResult = await dispatch(
                    setActivityAmount(
                        getMonthCodeString(monthCode),
                        category,
                        (currActivity: number) => currActivity + activity,
                    ),
                );
            }

            if ("error" in updateBudgetResult) {
                // We know updating budget failed
                return dispatch({ type: UPDATE_TRANSACTIONS_FAILURE, error: updateBudgetResult.error });
            }

            const setBalanceResult = await dispatch(
                setBalance(account, (currBalance: number) => currBalance + activity),
            );

            if ("error" in setBalanceResult) {
                // We know setting account balance failed
                return dispatch({ type: UPDATE_TRANSACTIONS_FAILURE, error: setBalanceResult.error });
            }

            return dispatch({ type: UPDATE_TRANSACTIONS_SUCCESS, transactions: newTransactions });
        } catch (error) {
            console.warn(error);
            return dispatch({ type: UPDATE_TRANSACTIONS_FAILURE, error });
        }
    };
};

export const deleteTransaction = (index: number): GenericTransactionThunkAction => {
    return async (
        dispatch: ThunkDispatch<ApplicationState, null, GenericTransactionAction>,
        getState: () => ApplicationState,
    ): Promise<GenericTransactionAction> => {
        dispatch({ type: UPDATING_TRANSACTIONS });
        const transactions = getState().transaction.transactions;

        try {
            // update transactions
            const newTransactions: Transaction[] = [...transactions];

            const oldTransaction = newTransactions.splice(index, 1);

            // Save transaction to local storage
            localStorage.setItem(TRANSACTIONS, JSON.stringify(newTransactions));

            // Update budget activity
            const monthCode: MonthCode = getMonthCodeFromDate(oldTransaction[0].date);

            let updateBudgetResult;

            // If we don't have a category, then just add the activity to our To-Be budgeted pool
            if (!oldTransaction[0].category) {
                updateBudgetResult = await dispatch(
                    setToBeBudgetedAmount((currActivity: number) => currActivity - oldTransaction[0].activity),
                );
            } else {
                updateBudgetResult = await dispatch(
                    setActivityAmount(
                        getMonthCodeString(monthCode),
                        oldTransaction[0].category,
                        (currActivity: number) => currActivity - oldTransaction[0].activity,
                    ),
                );
            }

            if ("error" in updateBudgetResult) {
                // We know updating budget failed
                return dispatch({ type: UPDATE_TRANSACTIONS_FAILURE, error: updateBudgetResult.error });
            }

            const setBalanceResult = await dispatch(
                setBalance(
                    oldTransaction[0].account,
                    (currBalance: number) => currBalance - oldTransaction[0].activity,
                ),
            );

            if ("error" in setBalanceResult) {
                // We know setting account balance failed
                return dispatch({ type: UPDATE_TRANSACTIONS_FAILURE, error: setBalanceResult.error });
            }

            return dispatch({ type: UPDATE_TRANSACTIONS_SUCCESS, transactions: newTransactions });
        } catch (error) {
            console.warn(error);
            return dispatch({ type: UPDATE_TRANSACTIONS_FAILURE, error });
        }
    };
};
