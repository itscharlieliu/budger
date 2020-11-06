import { AnyAction } from "redux";
import configureMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";

import { getMonthCodeFromDate, getMonthCodeString, MonthCode } from "../../utils/getMonthCode";
import {
    AccountType,
    UPDATE_ACCOUNT_SUCCESS,
    UPDATING_ACCOUNT,
    UPDATE_ACCOUNT_FAILURE,
} from "../accounts/accountsInterfaces";
import {
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
    SET_TOTAL_BUDGET_FAILURE,
    SETTING_TO_BE_BUDGETED,
    SET_TO_BE_BUDGETED_SUCCESS,
} from "../budget/budgetInterfaces";
import ApplicationState from "../index";
import { addTransaction, bulkAddTransaction, deleteTransaction } from "../transactions/transactionActions";
import {
    Transaction,
    UPDATE_TRANSACTIONS_FAILURE,
    UPDATE_TRANSACTIONS_SUCCESS,
    UPDATING_TRANSACTIONS,
} from "../transactions/transactionInterfaces";

type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>;

const mockStore = configureMockStore<unknown, Dispatch>([thunk]);

describe("transactions actions", () => {
    const testDate = new Date();

    const monthCode: MonthCode = getMonthCodeFromDate(testDate);

    const monthCodeString = getMonthCodeString(monthCode);

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
                    [monthCodeString]: {
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

        await store.dispatch(addTransaction("test payee", "test account", testDate, -70, "test category"));
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

    it("sets to be budgeted when adding transaction if we do not provide a category", async () => {
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
                totalBudget: {},
                toBeBudgeted: 100,
            },
        });

        // Add transaction without providing category
        await store.dispatch(addTransaction("test payee", "test account", testDate, -70));
        const actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // First set budget accurately
        expect(actions[1].type).toBe(SETTING_TO_BE_BUDGETED);
        expect(actions[2].type).toBe(SET_TO_BE_BUDGETED_SUCCESS);
        expect(actions[2].toBeBudgeted).toBe(100 - 70);

        // Then set account activity correctly
        expect(actions[3].type).toBe(UPDATING_ACCOUNT);
        expect(actions[4].type).toBe(UPDATE_ACCOUNT_SUCCESS);

        expect(actions[5].type).toBe(UPDATE_TRANSACTIONS_SUCCESS);
    });

    it("sets to be budgeted when deleting transaction if the transaction does not have a category", async () => {
        const store = mockStore({
            transaction: {
                transactions: [
                    {
                        account: "test account",
                        date: testDate,
                        payee: "test payee",
                        note: "hello",
                        activity: 27,
                    },
                ],
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
                totalBudget: {},
                toBeBudgeted: 100,
            },
        });

        // Add transaction without providing category
        await store.dispatch(deleteTransaction(0));
        const actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // First set budget accurately
        expect(actions[1].type).toBe(SETTING_TO_BE_BUDGETED);
        expect(actions[2].type).toBe(SET_TO_BE_BUDGETED_SUCCESS);
        expect(actions[2].toBeBudgeted).toBe(100 - 27);

        // Then set account activity correctly
        expect(actions[3].type).toBe(UPDATING_ACCOUNT);
        expect(actions[4].type).toBe(UPDATE_ACCOUNT_SUCCESS);

        expect(actions[5].type).toBe(UPDATE_TRANSACTIONS_SUCCESS);
    });

    it("does not try to add transaction unless all actions succeed", async () => {
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
                    [monthCodeString]: {
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

        // Add with invalid category
        await store.dispatch(
            addTransaction("invalid payee payee", "invalid account", testDate, -70, "invalid category"),
        );
        let actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // First set budget accurately
        expect(actions[1].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[2].type).toBe(SET_TOTAL_BUDGET_FAILURE);

        expect(actions[3].type).toBe(UPDATE_TRANSACTIONS_FAILURE);

        store.clearActions();

        // Add with valid category but invalid account
        await store.dispatch(addTransaction("invalid payee payee", "invalid account", testDate, -70, "test category"));

        actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // First set budget accurately
        expect(actions[1].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[2].type).toBe(SET_TOTAL_BUDGET_SUCCESS);

        expect(actions[3].type).toBe(UPDATING_ACCOUNT);
        expect(actions[4].type).toBe(UPDATE_ACCOUNT_FAILURE);

        expect(actions[5].type).toBe(UPDATE_TRANSACTIONS_FAILURE);
    });

    it("successfully deletes transaction", async () => {
        const store = mockStore({
            transaction: {
                transactions: [
                    {
                        account: "test account",
                        date: testDate,
                        payee: "test payee",
                        category: "test category",
                        note: "hello",
                        activity: 26,
                    },
                ],
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
                    [monthCodeString]: {
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

        // Delete with invalid category
        await store.dispatch(deleteTransaction(0));

        const actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // First set budget accurately
        expect(actions[1].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[2].type).toBe(SET_TOTAL_BUDGET_SUCCESS);

        expect(actions[3].type).toBe(UPDATING_ACCOUNT);
        expect(actions[4].type).toBe(UPDATE_ACCOUNT_SUCCESS);

        expect(actions[5].type).toBe(UPDATE_TRANSACTIONS_SUCCESS);
    });

    it("does not delete transaction unless all actions succeed", async () => {
        let store = mockStore({
            transaction: {
                transactions: [
                    {
                        account: "test account",
                        date: testDate,
                        payee: "test payee",
                        category: "invalid category",
                        note: "hello",
                        activity: 26,
                    },
                ],
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
                    [monthCodeString]: {
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

        // Delete with invalid category
        await store.dispatch(deleteTransaction(0));

        let actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // First set budget accurately
        expect(actions[1].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[2].type).toBe(SET_TOTAL_BUDGET_FAILURE);

        expect(actions[3].type).toBe(UPDATE_TRANSACTIONS_FAILURE);

        store = mockStore({
            transaction: {
                transactions: [
                    {
                        account: "invalid account",
                        date: testDate,
                        payee: "test payee",
                        category: "test category",
                        note: "hello",
                        activity: 26,
                    },
                ],
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
                    [monthCodeString]: {
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

        await store.dispatch(deleteTransaction(0));

        actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // First set budget accurately
        expect(actions[1].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[2].type).toBe(SET_TOTAL_BUDGET_SUCCESS);

        expect(actions[3].type).toBe(UPDATING_ACCOUNT);
        expect(actions[4].type).toBe(UPDATE_ACCOUNT_FAILURE);

        expect(actions[5].type).toBe(UPDATE_TRANSACTIONS_FAILURE);
    });

    it("bulk adds transactions", async () => {
        const existingTransaction = {
            account: "test account",
            date: new Date(),
            payee: "test payee",
            activity: 50,
        };

        const store = mockStore({
            transaction: {
                transactions: [existingTransaction],
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
                    [monthCodeString]: {
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

        const newTransactions: Transaction[] = [
            {
                account: "test account",
                date: new Date(),
                payee: "test payee",
                activity: 50,
            },
            {
                account: "test account 2",
                date: new Date(),
                payee: "test payee",
                activity: 50,
            },
            {
                account: "test account 2",
                date: new Date(),
                payee: "test payee",
                category: "test category",
                activity: 50,
            },
            {
                account: "test account 2",
                date: new Date(),
                payee: "test payee",
                category: "test category 2",
                activity: 50,
            },
        ];

        await store.dispatch(bulkAddTransaction(newTransactions));

        const actions = store.getActions();

        expect(actions[0].type).toBe(UPDATING_TRANSACTIONS);

        // Update categories
        expect(actions[1].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[2].type).toBe(SET_TOTAL_BUDGET_SUCCESS);

        expect(actions[3].type).toBe(UPDATE_TRANSACTIONS_SUCCESS);
        expect(actions[3].transactions).toEqual([existingTransaction, ...newTransactions]);
    });
});
