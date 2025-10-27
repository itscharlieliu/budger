import { useState, useEffect, useCallback } from "react";
import { ACCOUNTS } from "../defs/storageKeys";
import { BankAccount, AllAccounts } from "../store/accounts/accountsInterfaces";
import validateAccounts from "../utils/validateAccounts";

export interface UseAccountsReturn {
    allAccounts: AllAccounts;
    isLoading: boolean;
    error: string | null;
    addAccount: (account: BankAccount) => void;
    updateAccount: (accountIndex: number, updates: Partial<BankAccount>) => void;
    deleteAccount: (accountIndex: number) => void;
    setCachedBalance: (accountIndex: number, balance: number) => void;
}

export const useAccounts = (): UseAccountsReturn => {
    const [allAccounts, setAllAccounts] = useState<AllAccounts>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load accounts from localStorage on mount
    useEffect(() => {
        try {
            const totalAccountsJson = localStorage.getItem(ACCOUNTS);
            const accounts: BankAccount[] = totalAccountsJson ? JSON.parse(totalAccountsJson) : [];

            if (!validateAccounts(accounts)) {
                console.warn("Invalid accounts data", accounts);
                setError("Invalid accounts data");
                return;
            }

            setAllAccounts(accounts);
        } catch (error) {
            setError("Failed to load accounts");
        }
    }, []);

    const saveAccounts = useCallback((newAccounts: AllAccounts) => {
        localStorage.setItem(ACCOUNTS, JSON.stringify(newAccounts));
        setAllAccounts(newAccounts);
    }, []);

    const addAccount = useCallback(
        (account: BankAccount) => {
            setIsLoading(true);
            setError(null);

            try {
                const newAccounts = [...allAccounts, account];
                saveAccounts(newAccounts);
            } catch (error) {
                setError("Failed to add account");
            } finally {
                setIsLoading(false);
            }
        },
        [allAccounts, saveAccounts],
    );

    const updateAccount = useCallback(
        (accountIndex: number, updates: Partial<BankAccount>) => {
            setIsLoading(true);
            setError(null);

            try {
                if (accountIndex >= 0 && accountIndex < allAccounts.length) {
                    const newAccounts = [...allAccounts];
                    newAccounts[accountIndex] = { ...newAccounts[accountIndex], ...updates };
                    saveAccounts(newAccounts);
                } else {
                    setError("Account not found");
                }
            } catch (error) {
                setError("Failed to update account");
            } finally {
                setIsLoading(false);
            }
        },
        [allAccounts, saveAccounts],
    );

    const deleteAccount = useCallback(
        (accountIndex: number) => {
            setIsLoading(true);
            setError(null);

            try {
                if (accountIndex >= 0 && accountIndex < allAccounts.length) {
                    const newAccounts = allAccounts.filter((_, index) => index !== accountIndex);
                    saveAccounts(newAccounts);
                } else {
                    setError("Account not found");
                }
            } catch (error) {
                setError("Failed to delete account");
            } finally {
                setIsLoading(false);
            }
        },
        [allAccounts, saveAccounts],
    );

    const setCachedBalance = useCallback(
        (accountIndex: number, balance: number) => {
            setIsLoading(true);
            setError(null);

            try {
                if (accountIndex >= 0 && accountIndex < allAccounts.length) {
                    const newAccounts = [...allAccounts];
                    newAccounts[accountIndex].cachedBalance = balance;
                    saveAccounts(newAccounts);
                } else {
                    setError("Account not found");
                }
            } catch (error) {
                setError("Failed to set cached balance");
            } finally {
                setIsLoading(false);
            }
        },
        [allAccounts, saveAccounts],
    );

    return {
        allAccounts,
        isLoading,
        error,
        addAccount,
        updateAccount,
        deleteAccount,
        setCachedBalance,
    };
};
