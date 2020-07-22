import {
    GenericInitializationAction,
    InitializationState,
    SET_ACCOUNTS_INITIALIZED_FAILURE,
    SET_ACCOUNTS_INITIALIZED_SUCCESS,
    SET_BUDGET_INITIALIZED_FAILURE,
    SET_BUDGET_INITIALIZED_SUCCESS,
    SET_TRANSACTIONS_INITIALIZED_FAILURE,
    SET_TRANSACTIONS_INITIALIZED_SUCCESS,
    SET_TRANSLATION_INITIALIZED,
    SETTING_ACCOUNTS_INITIALIZED,
    SETTING_BUDGET_INITIALIZED,
    SETTING_TRANSACTIONS_INITIALIZED,
} from "./initializationInterfaces";

export const defaultInitializationState: InitializationState = {
    translationInitialized: false,
    budgetInitialized: false,
    transactionsInitialized: false,
    accountsInitialized: false,
    isSettingBudgetInitialized: false,
    isSettingTransactionsInitialized: false,
    isSettingAccountsInitialized: false,
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
        case SETTING_TRANSACTIONS_INITIALIZED: {
            return { ...state, isSettingTransactionsInitialized: true, transactionsInitialized: false };
        }
        case SET_TRANSACTIONS_INITIALIZED_SUCCESS: {
            return { ...state, isSettingTransactionsInitialized: false };
        }
        case SET_TRANSACTIONS_INITIALIZED_FAILURE: {
            return { ...state, error: action.error };
        }
        case SETTING_ACCOUNTS_INITIALIZED: {
            return { ...state, isSettingAccountsInitialized: true, accountsInitialized: false };
        }
        case SET_ACCOUNTS_INITIALIZED_SUCCESS: {
            return { ...state, isSettingAccountsInitialized: false };
        }
        case SET_ACCOUNTS_INITIALIZED_FAILURE: {
            return { ...state, error: action.error };
        }
        default: {
            return { ...state };
        }
    }
};

export default initializationReducer;
