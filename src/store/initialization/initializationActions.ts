import { ThunkAction, ThunkDispatch } from "redux-thunk";

import ERRORS from "../../defs/errors";
import { ACCOUNTS, BUDGET, TO_BE_BUDGETED, TRANSACTIONS } from "../../defs/storageKeys";
import validateAccounts from "../../utils/validateAccounts";
import validateTotalBudget from "../../utils/validateTotalBudget";
import validateTransactions from "../../utils/validateTransactions";
import { BankAccount } from "../accounts/accountsInterfaces";
import { TotalBudget } from "../budget/budgetInterfaces";
import ApplicationState from "../index";
import { Transaction } from "../transactions/transactionInterfaces";

import {
    GenericInitializationAction,
    GenericSetAccountsInitializedAction,
    GenericSetBudgetInitializedAction,
    GenericSetTransactionsInitializedAction,
    SET_ACCOUNTS_INITIALIZED_FAILURE,
    SET_ACCOUNTS_INITIALIZED_SUCCESS,
    SET_BUDGET_INITIALIZED_FAILURE,
    SET_BUDGET_INITIALIZED_SUCCESS,
    SET_TRANSACTIONS_INITIALIZED_FAILURE,
    SET_TRANSACTIONS_INITIALIZED_SUCCESS,
    SET_TRANSLATION_INITIALIZED,
    SETTING_ACCOUNTS_INITIALIZED,
    SETTING_BUDGET_INITIALIZED,
    SETTING_TRANSACTIONS_INITIALIZED,
    SetTranslationInitializedAction,
} from "./initializationInterfaces";

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

        const toBeBudgetedJson = localStorage.getItem(TO_BE_BUDGETED);
        const toBeBudgeted = toBeBudgetedJson ? JSON.parse(toBeBudgetedJson) : 0;

        dispatch({ type: SET_BUDGET_INITIALIZED_SUCCESS, totalBudget, toBeBudgeted });
    } catch (error) {
        dispatch({ type: SET_BUDGET_INITIALIZED_FAILURE, error });
    }
};

export const initTransactions = (): GenericInitializationThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetTransactionsInitializedAction>,
): Promise<void> => {
    dispatch({ type: SETTING_TRANSACTIONS_INITIALIZED });

    // TODO Move this to utils
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

    const dateParser = (key: string, value: unknown) => {
        if (typeof value === "string" && dateFormat.test(value)) {
            return new Date(value);
        }

        return value;
    };

    try {
        const totalTransactionsJson = localStorage.getItem(TRANSACTIONS);
        const transactions: Transaction[] = totalTransactionsJson ? JSON.parse(totalTransactionsJson, dateParser) : [];

        // TODO Validate transactions
        if (!validateTransactions(transactions)) {
            console.warn(ERRORS.invalidTransactions, transactions);
            dispatch({ type: SET_TRANSACTIONS_INITIALIZED_FAILURE, error: new Error(ERRORS.invalidTransactions) });
            return;
        }

        dispatch({ type: SET_TRANSACTIONS_INITIALIZED_SUCCESS, transactions });
    } catch (error) {
        dispatch({ type: SET_TRANSACTIONS_INITIALIZED_FAILURE, error });
    }
};

export const initAccounts = (): GenericInitializationThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericSetAccountsInitializedAction>,
): Promise<void> => {
    dispatch({ type: SETTING_ACCOUNTS_INITIALIZED });

    try {
        const totalAccountsJson = localStorage.getItem(ACCOUNTS);
        const accounts: BankAccount[] = totalAccountsJson ? JSON.parse(totalAccountsJson) : [];

        // TODO Validate accounts
        if (!validateAccounts(accounts)) {
            console.warn(ERRORS.invalidAccounts, accounts);
            dispatch({ type: SET_ACCOUNTS_INITIALIZED_FAILURE, error: new Error(ERRORS.invalidTransactions) });
            return;
        }

        dispatch({ type: SET_ACCOUNTS_INITIALIZED_SUCCESS, accounts });
    } catch (error) {
        dispatch({ type: SET_ACCOUNTS_INITIALIZED_FAILURE, error });
    }
};
