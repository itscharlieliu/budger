import {
    AccountsState,
    ADD_ACCOUNT_FAILURE,
    ADD_ACCOUNT_SUCCESS,
    ADDING_ACCOUNT,
    GenericAccountsAction,
} from "./accountsInterfaces";

export const defaultAccountsState: AccountsState = {
    allAccounts: [],
    isAddingAccount: false,
    error: null,
};

const accountsReducer = (state: AccountsState = defaultAccountsState, action: GenericAccountsAction): AccountsState => {
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
        default: {
            return { ...state };
        }
    }
};

export default accountsReducer;
