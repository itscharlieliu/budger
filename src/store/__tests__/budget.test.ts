import { AnyAction } from "redux";
import configureMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";

import ERRORS from "../../defs/errors";
import getMonthCode from "../../utils/getMonthCode";
import {
    addBudgetCategory,
    addBudgetGroup,
    addBudgetMonth,
    deleteBudgetCategory,
    deleteBudgetGroup,
    editBudgetedAmount,
    setActivityAmount,
} from "../budget/budgetActions";
import {
    ADD_MONTHLY_BUDGET_FAILURE,
    ADD_MONTHLY_BUDGET_SUCCESS,
    ADDING_MONTHLY_BUDGET,
    SET_TOTAL_BUDGET_FAILURE,
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
    TotalBudget,
} from "../budget/budgetInterfaces";
import budgetReducer from "../budget/budgetReducer";
import ApplicationState from "../index";

type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>;

const mockStore = configureMockStore<unknown, Dispatch>([thunk]);

const MONTH_CODE = "202009";

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

        expect(actions[0].type).toBe(ADDING_MONTHLY_BUDGET);
        expect(actions[1].type).toBe(ADD_MONTHLY_BUDGET_SUCCESS);
        expect(actions[1].totalBudget[getMonthCode(currDate)]).toEqual({});
    });

    it("doesn't add new month if month already exists", () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {},
                },
            },
        });

        store.dispatch(addBudgetMonth(MONTH_CODE));
        const actions = store.getActions();
        expect(actions[1].type).toBe(ADD_MONTHLY_BUDGET_FAILURE);
        expect(actions[1].error.message).toBe(ERRORS.monthAlreadyExists);
        expect(actions[2]).toBeUndefined();
    });

    it("successfully adds budget group", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {},
                },
            },
        });
        await store.dispatch(addBudgetGroup(MONTH_CODE, "test group"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget).toEqual({
            [MONTH_CODE]: {
                "test group": {},
            },
        });
    });

    it("successfully adds multiple budget groups", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {},
                    },
                },
            },
        });
        await store.dispatch(addBudgetGroup(MONTH_CODE, "test group 2"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget).toEqual({
            [MONTH_CODE]: {
                "test group": {},
                "test group 2": {},
            },
        });
    });

    it("does not add budget group if month does not have a budget", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {},
            },
        });

        await store.dispatch(addBudgetGroup(MONTH_CODE, "test group"));

        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].error.message).toBe(ERRORS.monthDoesNotExist);
    });

    it("does not add duplicate budget group", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {},
                    },
                },
            },
        });

        await store.dispatch(addBudgetGroup(MONTH_CODE, "test group"));

        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_FAILURE);
        expect(actions[1].error.message).toBe(ERRORS.groupAlreadyExists);
    });

    it("successfully adds category", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {},
                    },
                },
            },
        });
        await store.dispatch(addBudgetCategory(MONTH_CODE, "test group", "test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget).toEqual({
            [MONTH_CODE]: {
                "test group": {
                    "test category": {
                        budgeted: 0,
                        activity: 0,
                    },
                },
            },
        });
    });

    it("successfully adds multiple categories", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {
                            "test category": {
                                budgeted: 0,
                                activity: 0,
                            },
                        },
                    },
                },
            },
        });
        await store.dispatch(addBudgetCategory(MONTH_CODE, "test group", "test category 2"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget).toEqual({
            [MONTH_CODE]: {
                "test group": {
                    "test category": {
                        activity: 0,
                        budgeted: 0,
                    },
                    "test category 2": {
                        activity: 0,
                        budgeted: 0,
                    },
                },
            },
        });
    });

    it("does not add budget category if month does not have a budget", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {},
            },
        });

        await store.dispatch(addBudgetCategory(MONTH_CODE, "test group", "test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].error.message).toBe(ERRORS.monthDoesNotExist);
    });

    it("does not add budget category if budget group does not exist", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {},
                },
            },
        });

        await store.dispatch(addBudgetCategory(MONTH_CODE, "test group", "test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].error.message).toBe(ERRORS.groupDoesNotExist);
    });

    it("does not add budget category if budget category already exists", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {
                            "test category": {},
                        },
                        "test group 2": {},
                    },
                },
            },
        });

        await store.dispatch(addBudgetCategory(MONTH_CODE, "test group", "test category"));
        let actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].error.message).toBe(ERRORS.categoryAlreadyExists);

        store.clearActions();

        await store.dispatch(addBudgetCategory(MONTH_CODE, "test group 2", "test category"));
        actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].error.message).toBe(ERRORS.categoryAlreadyExists);
    });

    it("successfully deletes category", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {
                            "test category": {},
                        },
                    },
                },
            },
        });
        await store.dispatch(deleteBudgetCategory(MONTH_CODE, "test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget).toEqual({
            [MONTH_CODE]: {
                "test group": {},
            },
        });
    });

    it("sets error if delete category does not exist", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {},
                    },
                },
            },
        });
        await store.dispatch(deleteBudgetCategory(MONTH_CODE, "nonexistent test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_FAILURE);
        expect(actions[1].error.message).toBe(ERRORS.categoryDoesNotExist);
    });

    it("successfully deletes group", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {},
                    },
                },
            },
        });
        await store.dispatch(deleteBudgetGroup(MONTH_CODE, "test group"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget).toEqual({
            [MONTH_CODE]: {},
        });
    });

    it("successfully modifies budgeted amount", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {
                            "test category": {
                                budgeted: 69,
                            },
                        },
                    },
                },
            },
        });
        await store.dispatch(editBudgetedAmount(MONTH_CODE, "test category", 420));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget).toEqual({
            [MONTH_CODE]: {
                "test group": {
                    "test category": {
                        budgeted: 420,
                    },
                },
            },
        });
    });

    it("successfully modifies activity amount", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {
                            "test category": {
                                budgeted: 70,
                                activity: -10,
                            },
                        },
                    },
                },
            },
        });
        await store.dispatch(setActivityAmount(MONTH_CODE, "test category", -15));

        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget).toEqual({
            [MONTH_CODE]: {
                "test group": {
                    "test category": {
                        budgeted: 70,
                        activity: -15,
                    },
                },
            },
        });
    });
    it("can use function to set activity", async () => {
        const store = mockStore({
            budget: {
                totalBudget: {
                    [MONTH_CODE]: {
                        "test group": {
                            "test category": {
                                budgeted: 70,
                                activity: -10,
                            },
                        },
                    },
                },
            },
        });

        await store.dispatch(
            setActivityAmount(MONTH_CODE, "test category", (currActivityAmount: number): number => {
                return currActivityAmount + 30;
            }),
        );

        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
        expect(actions[1].totalBudget).toEqual({
            [MONTH_CODE]: {
                "test group": {
                    "test category": {
                        budgeted: 70,
                        activity: 20,
                    },
                },
            },
        });
    });
});

describe("budget reducer", () => {
    it("sets new budget", () => {
        const budgetState = budgetReducer(undefined, { type: SETTING_TOTAL_BUDGET });
        expect(budgetState.isSettingBudget).toEqual(true);

        const totalBudget: TotalBudget = {
            [MONTH_CODE]: {
                "test group": {
                    "test category": {
                        budgeted: 1999,
                        activity: 10,
                    },
                },
            },
        };

        const successBudgetState = budgetReducer(budgetState, { type: SET_TOTAL_BUDGET_SUCCESS, totalBudget });
        expect(successBudgetState.isSettingBudget).toEqual(false);
        expect(successBudgetState.totalBudget).toEqual(totalBudget);

        const error = new Error("test group error");
        const failureBudgetState = budgetReducer(budgetState, { type: SET_TOTAL_BUDGET_FAILURE, error });
        expect(failureBudgetState.isSettingBudget).toEqual(false);
        expect(failureBudgetState.error).toEqual(error);
    });
});
