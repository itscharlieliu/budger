import { addAccount } from "../accounts/accountsActions";
import {
    AccountType,
    UPDATE_ACCOUNT_FAILURE,
    UPDATE_ACCOUNT_SUCCESS,
    UPDATING_ACCOUNT,
} from "../accounts/accountsInterfaces";
import ERRORS from "../../defs/errors";
import configureMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import ApplicationState from "../index";
import { initBudget, setLanguageInitialized } from "../initialization/initializationActions";
import {
    SET_BUDGET_INITIALIZED_FAILURE,
    SET_BUDGET_INITIALIZED_SUCCESS,
    SET_TRANSLATION_INITIALIZED,
    SETTING_BUDGET_INITIALIZED,
} from "../initialization/initializationInterfaces";
import { BUDGET } from "../../defs/storageKeys";

type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>;

const mockStore = configureMockStore<unknown, Dispatch>([thunk]);

describe("initialization actions", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("successfully initializes language", () => {
        const store = mockStore({
            initialization: {
                translationInitialized: false,
            },
        });
        store.dispatch(setLanguageInitialized(true));
        const actions = store.getActions();

        expect(actions[0].type).toBe(SET_TRANSLATION_INITIALIZED);
        expect(actions[0].translationInitialized).toBe(true);
    });

    it("successfully initializes budget", async () => {
        const store = mockStore({
            initialization: {
                budgetInitialized: false,
                isSettingBudgetInitialized: false,
            },
        });
        await store.dispatch(initBudget());
        const actions = store.getActions();

        expect(actions[0].type).toBe(SETTING_BUDGET_INITIALIZED);
        expect(actions[1].type).toBe(SET_BUDGET_INITIALIZED_SUCCESS);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(BUDGET);
    });
});
