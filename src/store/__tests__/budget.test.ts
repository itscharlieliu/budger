import { AnyAction } from "redux";
import configureMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";

import ERRORS from "../../defs/errors";
import {
    addBudgetCategory,
    addBudgetGroup,
    addBudgetMonth,
    deleteBudgetCategory,
    deleteBudgetGroup,
} from "../budget/budgetActions";
import {
    SET_TOTAL_BUDGET_FAILURE,
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
    TotalBudget,
} from "../budget/budgetInterfaces";
import budgetReducer from "../budget/budgetReducer";
import ApplicationState from "../index";
import getMonthCode from "../../utils/getMonthCode";

type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>;

const mockStore = configureMockStore<unknown, Dispatch>([thunk]);

describe("budget actions", () => {
    it("successfully adds new budget for a new month", () => {
        const store = mockStore({
            budget: {
                totalBudget: {},
            },
        });

        const currDate = new Date();

        store.dispatch(addBudgetMonth(getMonthCode(currDate)));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget[getMonthCode(currDate)]).toEqual({});
    });

    it("successfully adds budget group", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [],
            },
        });
        await store.dispatch(addBudgetGroup("test group"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
    });

    it("does not add duplicate budget group", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [
                    {
                        group: "test group",
                    },
                ],
            },
        });

        await store.dispatch(addBudgetGroup("test group"));

        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_FAILURE);
        expect(actions[1].error.message).toBe(ERRORS.groupAlreadyExists);
    });

    it("successfully adds category", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [
                    {
                        group: "test group",
                        categories: [],
                    },
                ],
            },
        });
        await store.dispatch(addBudgetCategory("test group", "test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget[0].categories[0].category).toBe("test category");
    });

    it("does not add budget category if budget group does not exist", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [],
            },
        });
        await store.dispatch(addBudgetCategory("test group", "test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_FAILURE);
        expect(actions[1].error.message).toBe(ERRORS.groupDoesNotExist);
    });

    it("does not add budget category if budget category already exists", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [
                    {
                        group: "test group",
                        categories: [
                            {
                                category: "test category",
                            },
                        ],
                    },
                ],
            },
        });
        await store.dispatch(addBudgetCategory("test group", "test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_FAILURE);
        expect(actions[1].error.message).toBe(ERRORS.categoryAlreadyExists);
    });

    it("successfully deletes category", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [
                    {
                        group: "test group",
                        categories: [
                            {
                                category: "test category",
                            },
                        ],
                    },
                ],
            },
        });
        await store.dispatch(deleteBudgetCategory("test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget[0].categories[0]).toBe(undefined);
    });

    it("sets error if delete category does not exist", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [
                    {
                        group: "test group",
                        categories: [
                            {
                                category: "test category",
                            },
                        ],
                    },
                ],
            },
        });
        await store.dispatch(deleteBudgetCategory("nonexistent test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_FAILURE);
        expect(actions[1].error.message).toBe(ERRORS.categoryDoesNotExist);
    });

    it("successfully deletes group", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [
                    {
                        group: "test group",
                        categories: [
                            {
                                category: "test category",
                            },
                        ],
                    },
                ],
            },
        });
        await store.dispatch(deleteBudgetGroup("test group"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget[0]).toBe(undefined);
    });
});

describe("budget reducer", () => {
    it("sets new budget", () => {
        const budgetState = budgetReducer(undefined, { type: SETTING_TOTAL_BUDGET });
        expect(budgetState.isSettingBudget).toEqual(true);

        const totalBudget: TotalBudget = [
            {
                group: "test group",
                categories: [
                    {
                        category: "test category",
                        budgeted: 1999,
                        activity: 200,
                    },
                ],
            },
        ];

        const successBudgetState = budgetReducer(budgetState, { type: SET_TOTAL_BUDGET_SUCCESS, totalBudget });
        expect(successBudgetState.isSettingBudget).toEqual(false);
        expect(successBudgetState.totalBudget).toEqual(totalBudget);

        const error = new Error("test group error");
        const failureBudgetState = budgetReducer(budgetState, { type: SET_TOTAL_BUDGET_FAILURE, error });
        expect(failureBudgetState.isSettingBudget).toEqual(false);
        expect(failureBudgetState.error).toEqual(error);
    });
});
