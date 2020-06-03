import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";

import { updateBudget } from "../budget/budgetActions";
import { SET_TOTAL_BUDGET_SUCCESS, SETTING_TOTAL_BUDGET, TGenericBudgetAction } from "../budget/budgetInterfaces";
import budgetReducer, { defaultBudgetState } from "../budget/budgetReducer";
import IApplicationState from "../index";

type TDispatch = ThunkDispatch<IApplicationState, null, TGenericBudgetAction>;

const mockStore = configureMockStore<IApplicationState, TDispatch>([thunk]);

describe("budget actions", () => {
    let store: MockStoreEnhanced<IApplicationState, TDispatch>;

    beforeEach(() => {
        store = mockStore({ budget: defaultBudgetState });
    });

    it("successfully updates budget", async () => {
        const currDate = new Date();
        await store.dispatch(updateBudget(currDate, "testGroup", "testCategory", 5, -3));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_TOTAL_BUDGET);
        expect(actions[1].type).toBe(SET_TOTAL_BUDGET_SUCCESS);
    });
});

describe("budget reducer", () => {
    it("starts setting budget", async () => {
        const budgetState = budgetReducer(undefined, { type: SETTING_TOTAL_BUDGET });
        expect(budgetState.isSettingBudget).toEqual(true);
    });
});
