import { useState, useEffect, useCallback } from "react";
import { BankAccount, AllAccounts } from "../store/accounts/accountsInterfaces";
import { API_URL } from "../defs/urls";
import { useAuth } from "../contexts/AuthContext";

interface ServerAccount {
    id: number;
    name: string;
    account_type: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface UseAccountsReturn {
    allAccounts: AllAccounts;
    isLoading: boolean;
    error: string | null;
    addAccount: (account: BankAccount) => Promise<void>;
    updateAccount: (accountId: number, updates: Partial<BankAccount>) => Promise<void>;
    deleteAccount: (accountId: number) => Promise<void>;
    setCachedBalance: (accountId: number, balance: number) => Promise<void>;
}

// Convert server account to client account format
const convertServerAccount = (serverAccount: ServerAccount): BankAccount => {
    // Map server account_type to client type
    // For now, defaulting to budgeted. You may want to add a mapping logic here
    // or add a field to the server to track budgeted/unbudgeted
    return {
        id: serverAccount.id,
        name: serverAccount.name,
        cachedBalance: serverAccount.balance,
        accountType: serverAccount.account_type,
    };
};

export const useAccounts = (): UseAccountsReturn => {
    const [allAccounts, setAllAccounts] = useState<AllAccounts>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    // Load accounts from server on mount
    useEffect(() => {
        if (!token) {
            setAllAccounts([]);
            setIsLoading(false);
            return;
        }

        const fetchAccounts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/accounts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.success && Array.isArray(data.data)) {
                    const convertedAccounts = data.data.map(convertServerAccount);
                    setAllAccounts(convertedAccounts);
                } else {
                    setError(data.error || "Failed to load accounts");
                    setAllAccounts([]);
                }
            } catch (error) {
                console.error("Error fetching accounts:", error);
                setError("Failed to load accounts");
                setAllAccounts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, [token]);

    const addAccount = useCallback(
        async (account: BankAccount) => {
            if (!token) {
                setError("Not authenticated");
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Map client account_type to server account_type
                // Default to "checking" if account_type is not provided
                const accountType = account.accountType || "checking";

                const response = await fetch(`${API_URL}/accounts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: account.name,
                        account_type: accountType,
                        balance: account.cachedBalance,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    // Refetch accounts to get the updated list with IDs
                    const fetchResponse = await fetch(`${API_URL}/accounts`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const fetchData = await fetchResponse.json();

                    if (fetchData.success && Array.isArray(fetchData.data)) {
                        const convertedAccounts = fetchData.data.map(convertServerAccount);
                        setAllAccounts(convertedAccounts);
                    }
                } else {
                    setError(data.error || "Failed to add account");
                }
            } catch (error) {
                console.error("Error adding account:", error);
                setError("Failed to add account");
            } finally {
                setIsLoading(false);
            }
        },
        [token],
    );

    const updateAccount = useCallback(async (accountId: number, updates: Partial<BankAccount>) => {
        // TODO: Implement update endpoint on server
        setError("Update account not yet implemented on server");
    }, []);

    const deleteAccount = useCallback(async (accountId: number) => {
        // TODO: Implement delete endpoint on server
        setError("Delete account not yet implemented on server");
    }, []);

    const setCachedBalance = useCallback(async (accountId: number, balance: number) => {
        // TODO: Implement update endpoint on server to update balance
        setError("Update account balance not yet implemented on server");
    }, []);

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
