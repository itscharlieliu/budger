import {
    GenericTransactionAction,
    Transaction,
    TransactionState,
    UPDATE_TRANSACTIONS_FAILURE,
    UPDATE_TRANSACTIONS_SUCCESS,
    UPDATING_TRANSACTIONS,
} from "./transactionInterfaces";

const mockTransactions: Transaction[] = [
    {
        account: "checkings 1",
        date: new Date(),
        payee: "testPayee",
        category: "groceries",
        note: "test",
        activity: 5,
    },
    {
        account: "checkings 2",
        date: new Date(),
        payee: "testPayee2",
        category: "fun",
        note: "test2",
        activity: -5,
    },
];

export const defaultTransactionState: TransactionState = {
    transactions: mockTransactions,
    isUpdatingTransactions: false,
    error: null,
};

const transactionReducer = (
    state: TransactionState = defaultTransactionState,
    action: GenericTransactionAction,
): TransactionState => {
    switch (action.type) {
        case UPDATING_TRANSACTIONS: {
            return { ...state, isUpdatingTransactions: true, error: null };
        }
        case UPDATE_TRANSACTIONS_SUCCESS: {
            return { ...state, isUpdatingTransactions: false, transactions: action.transactions };
        }
        case UPDATE_TRANSACTIONS_FAILURE: {
            return { ...state, isUpdatingTransactions: false, error: action.error };
        }
        default: {
            return { ...state };
        }
    }
};

export default transactionReducer;
