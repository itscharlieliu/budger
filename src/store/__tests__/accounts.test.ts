import { AnyAction } from "redux";
import configureMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";

import ERRORS from "../../defs/errors";
import { addAccount } from "../accounts/accountsActions";
import {
    AccountType,
    UPDATE_ACCOUNT_FAILURE,
    UPDATE_ACCOUNT_SUCCESS,
    UPDATING_ACCOUNT,
    AllAccounts,
} from "../accounts/accountsInterfaces";
import accountsReducer from "../accounts/accountsReducer";
import ApplicationState from "../index";

type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>;

const mockStore = configureMockStore<unknown, Dispatch>([thunk]);

describe("accounts actions", () => {
    it("successfully adds account", async () => {
        const store = mockStore({
            accounts: {
                allAccounts: [],
            },
        });
        await store.dispatch(addAccount("test account", AccountType.budgeted, 30));
        const actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_ACCOUNT);
        expect(actions[1].type).toBe(UPDATE_ACCOUNT_SUCCESS);
    });

    it("does not add an account if it already exists", async () => {
        const store = mockStore({
            accounts: {
                allAccounts: [
                    {
                        name: "test account",
                        type: AccountType.budgeted,
                        balance: 100,
                    },
                ],
            },
        });
        await store.dispatch(addAccount("test account", AccountType.budgeted, 30));
        const actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_ACCOUNT);
        expect(actions[1].type).toBe(UPDATE_ACCOUNT_FAILURE);
        expect(actions[1].error.message).toBe(ERRORS.accountAlreadyExists);
    });
});

describe("accounts reducer", () => {
    it("adds account", () => {
        const accountsState = accountsReducer(undefined, { type: UPDATING_ACCOUNT });
        expect(accountsState.isAddingAccount).toEqual(true);

        const allAccounts: AllAccounts = [
            {
                name: "test account",
                type: AccountType.budgeted,
            },
        ];

        const successAccountsState = accountsReducer(accountsState, { type: UPDATE_ACCOUNT_SUCCESS, allAccounts });
        expect(successAccountsState.isAddingAccount).toEqual(false);
        expect(successAccountsState.allAccounts).toEqual(allAccounts);

        const error = new Error("test account error");
        const failureBudgetState = accountsReducer(accountsState, { type: UPDATE_ACCOUNT_FAILURE, error });
        expect(failureBudgetState.isAddingAccount).toEqual(false);
        expect(failureBudgetState.error).toEqual(error);
    });
});
