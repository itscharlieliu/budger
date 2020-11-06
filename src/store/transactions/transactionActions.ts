import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { TRANSACTIONS } from "../../defs/storageKeys";
import { getMonthCodeFromDate, getMonthCodeString, MonthCode } from "../../utils/getMonthCode";
import { setBalance } from "../accounts/accountsActions";
import { mergeBudgets, setActivityAmount, setToBeBudgetedAmount } from "../budget/budgetActions";
import { BudgetCategory, GenericBudgetAction, TotalBudget } from "../budget/budgetInterfaces";
import ApplicationState from "../index";

import {
    GenericTransactionAction,
    Transaction,
    UPDATE_TRANSACTIONS_FAILURE,
    UPDATE_TRANSACTIONS_SUCCESS,
    UPDATING_TRANSACTIONS,
} from "./transactionInterfaces";

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
                    setActivityAmount(monthCode, category, (currActivity: number) => currActivity + activity),
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

export const bulkAddTransaction = (transactions: Transaction[], targetDate: Date = new Date()) => {
    return async (
        dispatch: ThunkDispatch<ApplicationState, null, GenericTransactionAction>,
        getState: () => ApplicationState,
    ): Promise<GenericTransactionAction> => {
        dispatch({ type: UPDATING_TRANSACTIONS });

        interface CategoriesMap {
            toBeBudgeted: number;
            [categoryName: string]: number; // Activity
        }

        const currentTransactions: Transaction[] = getState().transaction.transactions;

        const validTransactions: Transaction[] = [];
        // TODO Add payees support

        // Create flat map of all categories
        const categoriesMap: CategoriesMap = { toBeBudgeted: 0 };

        for (const transaction of transactions) {
            if (!transaction.category) {
                categoriesMap.toBeBudgeted += transaction.activity;
            } else if (categoriesMap[transaction.category]) {
                categoriesMap[transaction.category] += transaction.activity;
            } else {
                categoriesMap[transaction.category] = transaction.activity;
            }

            validTransactions.push(transaction);
        }

        const monthCode = getMonthCodeString(getMonthCodeFromDate(targetDate));
        const currentBudget = getState().budget.totalBudget;

        // Map each category to it's parent group
        const groupMap: { [category: string]: string } = {};

        // Get category groups of every existing category in the current month
        for (const group of Object.keys(currentBudget[monthCode])) {
            for (const category of Object.keys(currentBudget[monthCode][group])) {
                groupMap[category] = group;
            }
        }

        // Create new total budget from the categories we parsed
        const newTotalBudget: TotalBudget = { [monthCode]: {} };

        for (const category in Object.keys(categoriesMap)) {
            // if category already exists in our budget, add it to the correct group
            if (groupMap[category]) {
                const groupName = groupMap[category];
                if (newTotalBudget[monthCode][groupName] === undefined) {
                    // Create a new group if it doesn't exist yet
                    newTotalBudget[monthCode][groupName] = {
                        [category]: {
                            activity: categoriesMap[category],
                            budgeted: 0,
                        },
                    };
                    continue;
                }
                // if the group already exists, just add the category to the group
                newTotalBudget[monthCode][groupName][category] = {
                    activity: categoriesMap[category],
                    budgeted: 0,
                };
                continue;
            }
            // Category does not exist in our budget. We will put it in uncategorized
            if (newTotalBudget[monthCode]["Uncategorized"] === undefined) {
                newTotalBudget[monthCode]["Uncategorized"] = {
                    [category]: {
                        activity: categoriesMap[category],
                        budgeted: 0,
                    },
                };
                continue;
            }
            newTotalBudget[monthCode]["Uncategorized"][category] = {
                activity: categoriesMap[category],
                budgeted: 0,
            };
        }

        await dispatch(mergeBudgets(newTotalBudget));

        return dispatch({
            type: UPDATE_TRANSACTIONS_SUCCESS,
            transactions: [...currentTransactions, ...validTransactions],
        });
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
                        monthCode,
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
