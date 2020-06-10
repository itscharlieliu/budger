import {
    ADD_TRANSACTION_SUCCESS,
    ADDING_TRANSACTION,
    GenericTransactionAction,
    Transaction,
    TransactionState,
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
    isAddingTransaction: false,
    error: null,
};

const transactionReducer = (
    state: TransactionState = defaultTransactionState,
    action: GenericTransactionAction,
): TransactionState => {
    switch (action.type) {
        case ADDING_TRANSACTION: {
            return { ...state, isAddingTransaction: true, error: null };
        }
        case ADD_TRANSACTION_SUCCESS: {
            return { ...state, isAddingTransaction: false, transactions: action.transactions };
        }
        default: {
            return { ...state };
        }
    }
};

export default transactionReducer;
