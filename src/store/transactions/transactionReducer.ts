import {
    GenericTransactionAction,
    TransactionState,
    UPDATE_TRANSACTIONS_FAILURE,
    UPDATE_TRANSACTIONS_SUCCESS,
    UPDATING_TRANSACTIONS,
} from "./transactionInterfaces";

export const defaultTransactionState: TransactionState = {
    transactions: [],
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
