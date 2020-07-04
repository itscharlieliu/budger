import {
    AccountsState,
    AccountType,
    ADD_ACCOUNT_FAILURE,
    ADD_ACCOUNT_SUCCESS,
    ADDING_ACCOUNT,
    AllAccounts,
    GenericAccountsAction,
} from "./accountsInterfaces";

// TODO remove this when done
const mockAccounts: AllAccounts = [
    {
        name: "Test Account 1",
        type: AccountType.budgeted,
        balance: 100,
    },
    {
        name: "Test Account 2",
        type: AccountType.unbudgeted,
        balance: 100,
    },
];

export const defaultAccountsState: AccountsState = {
    allAccounts: mockAccounts,
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
