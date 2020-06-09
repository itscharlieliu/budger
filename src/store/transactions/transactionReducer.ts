import {
    ADD_TRANSACTION_SUCCESS,
    ADDING_TRANSACTION,
    GenericTransactionAction,
    TransactionState,
} from "./transactionInterfaces";

export const defaultTransactionState: TransactionState = {
    transactions: [],
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
