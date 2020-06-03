import thunk, { ThunkDispatch } from "redux-thunk";
import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import IApplicationState from "../index";
import { SET_TOTAL_BUDGET_SUCCESS, SETTING_TOTAL_BUDGET, TGenericBudgetAction } from "../budget/budgetInterfaces";
import budgetReducer, { defaultBudgetState } from "../budget/budgetReducer";
import { updateBudget } from "../budget/budgetActions";
import { Action } from "redux";
import rootReducer from "../rootReducer";

type TDispatch = ThunkDispatch<IApplicationState, null, TGenericBudgetAction>;

const mockStore = configureMockStore<IApplicationState, TDispatch>([thunk]);

describe("budget actions", () => {
    let store: MockStoreEnhanced<IApplicationState, TDispatch>;

    beforeEach(() => {
        store = mockStore({ budget: defaultBudgetState });
    });

    it("successfully updates budget", async () => {
        const currDate = new Date();
        // @ts-ignore
        await store.dispatch(updateBudget(currDate, "testGroup", "testCategory"));
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
