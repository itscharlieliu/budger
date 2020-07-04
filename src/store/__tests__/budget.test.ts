import { AnyAction } from "redux";
import configureMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";

import { addBudgetCategory, addBudgetGroup } from "../budget/budgetActions";
import {
    ADD_BUDGET_CATEGORY_FAILURE,
    ADD_BUDGET_CATEGORY_SUCCESS,
    ADD_BUDGET_GROUP_FAILURE,
    ADD_BUDGET_GROUP_SUCCESS,
    ADDING_BUDGET_CATEGORY,
    ADDING_BUDGET_GROUP,
    TotalBudget,
} from "../budget/budgetInterfaces";
import budgetReducer from "../budget/budgetReducer";
import ApplicationState from "../index";

type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>;

const mockStore = configureMockStore<unknown, Dispatch>([thunk]);

describe("budget actions", () => {
    it("successfully adds budget group", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [],
            },
        });
        await store.dispatch(addBudgetGroup("test group"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(ADDING_BUDGET_GROUP);
        expect(actions[1].type).toBe(ADD_BUDGET_GROUP_SUCCESS);
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

        expect(actions[0].type).toBe(ADDING_BUDGET_GROUP);
        expect(actions[1].type).toBe(ADD_BUDGET_GROUP_FAILURE);
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

        expect(actions[0].type).toBe(ADDING_BUDGET_CATEGORY);
        expect(actions[1].type).toBe(ADD_BUDGET_CATEGORY_SUCCESS);
    });

    it("does not add budget category if budget group does not exist", async () => {
        const store = mockStore({
            budget: {
                totalBudget: [],
            },
        });
        await store.dispatch(addBudgetCategory("test group", "test category"));
        const actions = store.getActions();

        expect(actions[0].type).toBe(ADDING_BUDGET_CATEGORY);
        expect(actions[1].type).toBe(ADD_BUDGET_CATEGORY_FAILURE);
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

        expect(actions[0].type).toBe(ADDING_BUDGET_CATEGORY);
        expect(actions[1].type).toBe(ADD_BUDGET_CATEGORY_FAILURE);
    });
});

describe("budget reducer", () => {
    it("adds budget group", () => {
        const budgetState = budgetReducer(undefined, { type: ADDING_BUDGET_GROUP });
        expect(budgetState.isAddingBudgetGroup).toEqual(true);

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

        const successBudgetState = budgetReducer(budgetState, { type: ADD_BUDGET_GROUP_SUCCESS, totalBudget });
        expect(successBudgetState.isAddingBudgetGroup).toEqual(false);
        expect(successBudgetState.totalBudget).toEqual(totalBudget);

        const error = new Error("test group error");
        const failureBudgetState = budgetReducer(budgetState, { type: ADD_BUDGET_GROUP_FAILURE, error });
        expect(failureBudgetState.isAddingBudgetGroup).toEqual(false);
        expect(failureBudgetState.error).toEqual(error);
    });

    it("adds budget category", () => {
        const budgetState = budgetReducer(undefined, { type: ADDING_BUDGET_CATEGORY });
        expect(budgetState.isAddingBudgetCategory).toEqual(true);

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

        const successBudgetState = budgetReducer(budgetState, { type: ADD_BUDGET_CATEGORY_SUCCESS, totalBudget });
        expect(successBudgetState.isAddingBudgetCategory).toEqual(false);
        expect(successBudgetState.totalBudget).toEqual(totalBudget);

        const error = new Error("test category error");
        const failureBudgetState = budgetReducer(budgetState, { type: ADD_BUDGET_CATEGORY_FAILURE, error });
        expect(failureBudgetState.isAddingBudgetCategory).toEqual(false);
        expect(failureBudgetState.error).toEqual(error);
    });
});
