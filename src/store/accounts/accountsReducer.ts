import { AccountsState, AccountType, AllAcounts, GenericAccountsAction } from "./accountsInterfaces";

// TODO remove this when done
const mockAccounts: AllAcounts = [
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
    allAcounts: mockAccounts,
    isAddingAccount: false,
    error: null,
};

const accountsReducer = (state: AccountsState = defaultAccountsState, action: GenericAccountsAction): AccountsState => {
    switch (action.type) {
        default: {
            return { ...state };
        }
    }
};

export default accountsReducer;
