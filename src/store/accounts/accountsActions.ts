import { ThunkAction, ThunkDispatch } from "redux-thunk";

import ERRORS from "../../defs/errors";
import ApplicationState from "../index";

import {
    AccountType,
    UPDATE_ACCOUNT_FAILURE,
    UPDATE_ACCOUNT_SUCCESS,
    UPDATING_ACCOUNT,
    AllAccounts,
    BankAccount,
    GenericAccountsAction,
    GenericUpdateAccountAction,
} from "./accountsInterfaces";
import { ACCOUNTS, TRANSACTIONS } from "../../defs/storageKeys";

type GenericAccountsThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericAccountsAction>;

export const addAccount = (
    name: string,
    type: AccountType = AccountType.unbudgeted,
    startingBalance: number = 0,
): GenericAccountsThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericUpdateAccountAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: UPDATING_ACCOUNT });

    const allAccounts = getState().accounts.allAccounts;

    // Return if account already exists
    if (allAccounts.some((bankAccount: BankAccount) => bankAccount.name === name)) {
        dispatch({ type: UPDATE_ACCOUNT_FAILURE, error: new Error(ERRORS.accountAlreadyExists) });
        return;
    }

    // TODO dispatch add transaction for starting balance

    const updatedAccounts: AllAccounts = [
        {
            name,
            type,
            cachedBalance: 0,
        },
        ...allAccounts,
    ];

    // Save account to local storage
    localStorage.setItem(ACCOUNTS, JSON.stringify(updatedAccounts));

    dispatch({ type: UPDATE_ACCOUNT_SUCCESS, allAccounts: updatedAccounts });
};

export const deleteAccount = (name: string): GenericAccountsThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericUpdateAccountAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: UPDATING_ACCOUNT });

    const allAccounts = getState().accounts.allAccounts;

    const updatedAccounts: AllAccounts = [];

    for (const account of allAccounts) {
        // Don't push account if it matches the name we want to delete
        if (account.name === name) {
            continue;
        }
        updatedAccounts.push(account);
    }

    // Save account to local storage
    localStorage.setItem(ACCOUNTS, JSON.stringify(updatedAccounts));

    dispatch({ type: UPDATE_ACCOUNT_SUCCESS, allAccounts: updatedAccounts });
};
