import { AnyAction } from "redux";
import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";

import { addBudgetGroup } from "../budget/budgetActions";
import { ADD_BUDGET_GROUP_SUCCESS, ADDING_BUDGET_GROUP } from "../budget/budgetInterfaces";
import budgetReducer from "../budget/budgetReducer";
import ApplicationState from "../index";
import rootReducer from "../rootReducer";

type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>;

const mockStore = configureMockStore<ApplicationState, Dispatch>([thunk]);

describe("budget actions", () => {
    let budgetStore: MockStoreEnhanced<ApplicationState, Dispatch>;

    beforeEach(() => {
        budgetStore = mockStore(rootReducer(undefined, { type: undefined }));
    });

    it("successfully adds budget group", async () => {
        await budgetStore.dispatch(addBudgetGroup("test group"));
        const actions = budgetStore.getActions();

        expect(actions[0].type).toBe(ADDING_BUDGET_GROUP);
        expect(actions[1].type).toBe(ADD_BUDGET_GROUP_SUCCESS);
    });
});

describe("budget reducer", () => {
    it("adds budget group", async () => {
        const budgetState = budgetReducer(undefined, { type: ADDING_BUDGET_GROUP });
        expect(budgetState.isAddingBudgetGroup).toEqual(true);
    });
});
