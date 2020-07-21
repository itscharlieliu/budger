import { ThunkAction, ThunkDispatch } from "redux-thunk";

import ERRORS from "../../defs/errors";
import ApplicationState from "../index";

import {
    AccountType,
    ADD_ACCOUNT_FAILURE,
    ADD_ACCOUNT_SUCCESS,
    ADDING_ACCOUNT,
    AllAccounts,
    BankAccount,
    GenericAccountsAction,
    GenericAddAccountAction,
} from "./accountsInterfaces";
import { ACCOUNTS, TRANSACTIONS } from "../../defs/storageKeys";

type GenericAccountsThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericAccountsAction>;

export const addAccount = (
    name: string,
    type: AccountType = AccountType.unbudgeted,
    startingBalance: number = 0,
): GenericAccountsThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericAddAccountAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: ADDING_ACCOUNT });

    const allAccounts = getState().accounts.allAccounts;

    // Return if account already exists
    if (allAccounts.some((bankAccount: BankAccount) => bankAccount.name === name)) {
        dispatch({ type: ADD_ACCOUNT_FAILURE, error: new Error(ERRORS.accountAlreadyExists) });
        return;
    }

    // TODO dispatch add transaction for starting balance

    const updatedAccounts: AllAccounts = [
        {
            name,
            type,
        },
        ...allAccounts,
    ];

    // Save account to local storage
    localStorage.setItem(ACCOUNTS, JSON.stringify(updatedAccounts));

    dispatch({ type: ADD_ACCOUNT_SUCCESS, allAccounts: updatedAccounts });
};
