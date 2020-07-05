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

type GenericAccountsThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericAccountsAction>;

export const addAccount = (
    name: string,
    type: AccountType = AccountType.unbudgeted,
    balance: number = 0,
): GenericAccountsThunkAction => async (
    dispatch: ThunkDispatch<ApplicationState, null, GenericAddAccountAction>,
    getState: () => ApplicationState,
): Promise<void> => {
    dispatch({ type: ADDING_ACCOUNT });

    const allAccounts = getState().accounts.allAccounts;

    if (allAccounts.some((bankAccount: BankAccount) => bankAccount.name === name)) {
        dispatch({ type: ADD_ACCOUNT_FAILURE, error: new Error(ERRORS.accountAlreadyExists) });
        return;
    }

    const updatedAccounts: AllAccounts = [
        {
            name,
            type,
            balance,
        },
        ...allAccounts,
    ];

    dispatch({ type: ADD_ACCOUNT_SUCCESS, allAccounts: updatedAccounts });
};
