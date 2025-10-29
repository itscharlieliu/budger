import { useState, useEffect, useCallback } from "react";
import { TRANSACTIONS } from "../defs/storageKeys";
import { Transaction } from "../store/transactions/transactionInterfaces";
import validateTransactions from "../utils/validateTransactions";

export interface UseTransactionsReturn {
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (transactionId: string) => void;
    updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
}

export const useTransactions = (): UseTransactionsReturn => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load transactions from localStorage on mount
    useEffect(() => {
        try {
            const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
            const dateParser = (key: string, value: unknown) => {
                if (typeof value === "string" && dateFormat.test(value)) {
                    return new Date(value);
                }
                return value;
            };

            const totalTransactionsJson = localStorage.getItem(TRANSACTIONS);
            const transactions: Transaction[] = totalTransactionsJson
                ? JSON.parse(totalTransactionsJson, dateParser)
                : [];

            if (!validateTransactions(transactions)) {
                console.warn("Invalid transactions data", transactions);
                setError("Invalid transactions data");
                return;
            }

            setTransactions(transactions);
        } catch (error) {
            setError("Failed to load transactions");
        }
    }, []);

    const saveTransactions = useCallback((newTransactions: Transaction[]) => {
        localStorage.setItem(TRANSACTIONS, JSON.stringify(newTransactions));
        setTransactions(newTransactions);
    }, []);

    const addTransaction = useCallback(
        (transaction: Transaction) => {
            setIsLoading(true);
            setError(null);

            try {
                const newTransactions = [...transactions, transaction];
                saveTransactions(newTransactions);
            } catch (error) {
                setError("Failed to add transaction");
            } finally {
                setIsLoading(false);
            }
        },
        [transactions, saveTransactions],
    );

    const deleteTransaction = useCallback(
        (transactionId: string) => {
            setIsLoading(true);
            setError(null);

            try {
                const newTransactions = transactions.filter((_, index) => index.toString() !== transactionId);
                saveTransactions(newTransactions);
            } catch (error) {
                setError("Failed to delete transaction");
            } finally {
                setIsLoading(false);
            }
        },
        [transactions, saveTransactions],
    );

    const updateTransaction = useCallback(
        (transactionId: string, updates: Partial<Transaction>) => {
            setIsLoading(true);
            setError(null);

            try {
                const index = parseInt(transactionId);
                if (index >= 0 && index < transactions.length) {
                    const newTransactions = [...transactions];
                    newTransactions[index] = { ...newTransactions[index], ...updates };
                    saveTransactions(newTransactions);
                } else {
                    setError("Transaction not found");
                }
            } catch (error) {
                setError("Failed to update transaction");
            } finally {
                setIsLoading(false);
            }
        },
        [transactions, saveTransactions],
    );

    return {
        transactions,
        isLoading,
        error,
        addTransaction,
        deleteTransaction,
        updateTransaction,
    };
};
