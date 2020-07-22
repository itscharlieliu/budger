import {
    AccountsState,
    ADD_ACCOUNT_FAILURE,
    ADD_ACCOUNT_SUCCESS,
    ADDING_ACCOUNT,
    GenericAccountsAction,
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
