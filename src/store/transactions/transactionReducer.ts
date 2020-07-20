import {
    GenericTransactionAction,
    TransactionState,
    UPDATE_TRANSACTIONS_FAILURE,
    UPDATE_TRANSACTIONS_SUCCESS,
    UPDATING_TRANSACTIONS,
} from "./transactionInterfaces";
import {
    SET_TRANSACTIONS_INITIALIZED_SUCCESS,
    SetTransactionsInitializedSuccessAction,
} from "../initialization/initializationInterfaces";

export const defaultTransactionState: TransactionState = {
    transactions: [],
    isUpdatingTransactions: false,
    error: null,
};

const transactionReducer = (
    state: TransactionState = defaultTransactionState,
    action: GenericTransactionAction | SetTransactionsInitializedSuccessAction,
): TransactionState => {
    switch (action.type) {
        case SET_TRANSACTIONS_INITIALIZED_SUCCESS: {
            return { ...state, transactions: action.transactions };
        }
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
