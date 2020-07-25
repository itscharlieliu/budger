import {
    AccountsState,
    ADD_ACCOUNT_FAILURE,
    ADD_ACCOUNT_SUCCESS,
    ADDING_ACCOUNT,
    GenericAccountsAction,
    SET_CACHED_BALANCE_FAILURE,
    SET_CACHED_BALANCE_SUCCESS,
} from "./accountsInterfaces";
import {
    SET_ACCOUNTS_INITIALIZED_SUCCESS,
    SetAccountsInitializedSuccessAction,
} from "../initialization/initializationInterfaces";

export const defaultAccountsState: AccountsState = {
    allAccounts: [],
    isAddingAccount: false,
    error: null,
};

const accountsReducer = (
    state: AccountsState = defaultAccountsState,
    action: GenericAccountsAction | SetAccountsInitializedSuccessAction,
): AccountsState => {
    switch (action.type) {
        case SET_CACHED_BALANCE_SUCCESS: {
            return { ...state, allAccounts: action.allAccounts };
        }
        case SET_CACHED_BALANCE_FAILURE: {
            return { ...state, error: action.error };
        }
        case ADDING_ACCOUNT: {
            return { ...state, isAddingAccount: true };
        }
        case ADD_ACCOUNT_SUCCESS: {
            return { ...state, isAddingAccount: false, allAccounts: action.allAccounts };
        }
        case ADD_ACCOUNT_FAILURE: {
            return { ...state, isAddingAccount: false, error: action.error };
        }
        case SET_ACCOUNTS_INITIALIZED_SUCCESS: {
            return { ...state, allAccounts: action.accounts };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountsReducer;
