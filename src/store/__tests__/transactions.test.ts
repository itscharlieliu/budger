import { AnyAction } from "redux";
import configureMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";

import getMonthCode from "../../utils/getMonthCode";
import {
    AccountType,
    UPDATE_ACCOUNT_SUCCESS,
    UPDATING_ACCOUNT,
    UPDATE_ACCOUNT_FAILURE,
} from "../accounts/accountsInterfaces";
import { SET_TOTAL_BUDGET_SUCCESS, SETTING_TOTAL_BUDGET, SET_TOTAL_BUDGET_FAILURE } from "../budget/budgetInterfaces";
import ApplicationState from "../index";
import { addTransaction } from "../transactions/transactionActions";
import {
    UPDATE_TRANSACTIONS_FAILURE,
    UPDATE_TRANSACTIONS_SUCCESS,
    UPDATING_TRANSACTIONS,
} from "../transactions/transactionInterfaces";

type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>;

const mockStore = configureMockStore<unknown, Dispatch>([thunk]);

describe("transactions actions", () => {
    const testDate = new Date();

    const monthCode = getMonthCode(testDate);

    it("successfully adds transaction", async () => {
        const store = mockStore({
            transaction: {
                transactions: [],
                isUpdatingTransactions: false,
                error: null,
            },
            accounts: {
                allAccounts: [
                    {
                        name: "test account",
                        type: AccountType.budgeted,
                        balance: 100,
                    },
                ],
            },
            budget: {
                totalBudget: {
                    [monthCode]: {
                        "test group": {
                            "test category": {
                                budgeted: 70,
                                activity: -15,
                            },
                        },
                    },
                },
            },
        });

        await store.dispatch(addTransaction("test payee", "test account", "test category", testDate, -70));
        const actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // First set budget accurately
        expect(actions[1].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[2].type).toBe(SET_TOTAL_BUDGET_SUCCESS);

        // Then set account activity correctly
        expect(actions[3].type).toBe(UPDATING_ACCOUNT);
        expect(actions[4].type).toBe(UPDATE_ACCOUNT_SUCCESS);

        expect(actions[5].type).toBe(UPDATE_TRANSACTIONS_SUCCESS);
    });

    it("does not try to update accounts unless budget actions succeed", async () => {
        const store = mockStore({
            transaction: {
                transactions: [],
                isUpdatingTransactions: false,
                error: null,
            },
            accounts: {
                allAccounts: [
                    {
                        name: "test account",
                        type: AccountType.budgeted,
                        balance: 100,
                    },
                ],
            },
            budget: {
                totalBudget: {
                    [monthCode]: {
                        "test group": {
                            "test category": {
                                budgeted: 70,
                                activity: -15,
                            },
                        },
                    },
                },
            },
        });

        await store.dispatch(
            addTransaction("invalid payee payee", "invalid account", "invalid category", testDate, -70),
        );
        const actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // First set budget accurately
        expect(actions[1].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[2].type).toBe(SET_TOTAL_BUDGET_FAILURE);

        expect(actions[3].type).toBe(UPDATE_TRANSACTIONS_FAILURE);
    });
});

// TODO Add fail tests
