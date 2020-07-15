import {
    GenericInitializationAction,
    InitializationState,
    SET_BUDGET_INITIALIZED_FAILURE,
    SET_BUDGET_INITIALIZED_SUCCESS,
    SET_TRANSLATION_INITIALIZED,
    SETTING_BUDGET_INITIALIZED,
} from "./initializationInterfaces";

export const defaultInitializationState: InitializationState = {
    translationInitialized: false,
    budgetInitialized: false,
    isSettingBudgetInitialized: false,
    error: null,
};

const initializationReducer = (
    state: InitializationState = defaultInitializationState,
    action: GenericInitializationAction,
): InitializationState => {
    switch (action.type) {
        case SET_TRANSLATION_INITIALIZED: {
            return { ...state, translationInitialized: action.translationInitialized };
        }
        case SETTING_BUDGET_INITIALIZED: {
            return { ...state, isSettingBudgetInitialized: true, budgetInitialized: false };
        }
        case SET_BUDGET_INITIALIZED_SUCCESS: {
            return { ...state, isSettingBudgetInitialized: false, budgetInitialized: true };
        }
        case SET_BUDGET_INITIALIZED_FAILURE: {
            return { ...state, isSettingBudgetInitialized: false, error: action.error };
        }
        default: {
            return { ...state };
        }
    }
};

export default initializationReducer;
