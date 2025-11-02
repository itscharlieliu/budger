import { useState, useEffect, useCallback } from "react";
import { Transaction } from "../store/transactions/transactionInterfaces";
import { API_URL } from "../defs/urls";
import { useAuth } from "../contexts/AuthContext";

interface ServerTransaction {
    id: number;
    amount: number;
    payee: string | null;
    description: string | null;
    category_name: string | null;
    transaction_date: string;
    account_id: number;
    account_name: string;
}

export interface UseTransactionsReturn {
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
    addTransaction: (transaction: Transaction) => Promise<void>;
    deleteTransaction: (transactionId: string) => Promise<void>;
    updateTransaction: (transactionId: string, updates: Partial<Transaction>) => Promise<void>;
}

// Convert server transaction to client transaction format
// TODO Migrate so that server and client have the same format
const convertServerTransaction = (serverTransaction: ServerTransaction): Transaction => {
    // Determine activity: positive for income, negative for expense (in cents)
    let activity = serverTransaction.amount * 100; // Convert dollars to cents

    const payee = serverTransaction.payee || "";
    // Note is stored in description field for new transactions
    // For old transactions (where payee was in description), note should be undefined
    const note = serverTransaction.description || undefined;

    return {
        id: serverTransaction.id.toString(),
        account: serverTransaction.account_name,
        account_id: serverTransaction.account_id,
        date: new Date(serverTransaction.transaction_date),
        payee,
        category: serverTransaction.category_name || undefined,
        note,
        activity,
    };
};

export const useTransactions = (): UseTransactionsReturn => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    // Load transactions from server on mount
    useEffect(() => {
        if (!token) {
            setTransactions([]);
            setIsLoading(false);
            return;
        }

        const fetchTransactions = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/transactions`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.success && Array.isArray(data.data)) {
                    const convertedTransactions = data.data.map(convertServerTransaction);
                    setTransactions(convertedTransactions);
                } else {
                    setError(data.error || "Failed to load transactions");
                    setTransactions([]);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError("Failed to load transactions");
                setTransactions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [token]);

    const addTransaction = useCallback(
        async (transaction: Transaction) => {
            if (!token) {
                setError("Not authenticated");
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/transactions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        account_id: transaction.account_id,
                        payee: transaction.payee,
                        date: transaction.date.toISOString(),
                        category: transaction.category,
                        note: transaction.note,
                        activity: transaction.activity,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    // Refetch transactions to get the updated list with IDs
                    const fetchResponse = await fetch(`${API_URL}/transactions`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const fetchData = await fetchResponse.json();

                    if (fetchData.success && Array.isArray(fetchData.data)) {
                        const convertedTransactions = fetchData.data.map(convertServerTransaction);
                        setTransactions(convertedTransactions);
                    }
                } else {
                    setError(data.error || "Failed to add transaction");
                }
            } catch (error) {
                console.error("Error adding transaction:", error);
                setError("Failed to add transaction");
            } finally {
                setIsLoading(false);
            }
        },
        [token],
    );

    const deleteTransaction = useCallback(
        async (transactionId: string) => {
            if (!token) {
                setError("Not authenticated");
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.success) {
                    // Remove transaction from local state
                    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
                } else {
                    setError(data.error || "Failed to delete transaction");
                }
            } catch (error) {
                console.error("Error deleting transaction:", error);
                setError("Failed to delete transaction");
            } finally {
                setIsLoading(false);
            }
        },
        [token],
    );

    const updateTransaction = useCallback(async (transactionId: string, updates: Partial<Transaction>) => {
        // TODO: Implement update endpoint on server
        setError("Update transaction not yet implemented on server");
    }, []);

    return {
        transactions,
        isLoading,
        error,
        addTransaction,
        deleteTransaction,
        updateTransaction,
    };
};
