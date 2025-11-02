export interface Transaction {
    id?: string;
    account: string; // Account name for display
    account_id?: number; // Account ID for API calls
    date: Date;
    payee: string;
    category?: string;
    note?: string;
    activity: number;
}

export interface TransactionState {
    transactions: Transaction[];
    isUpdatingTransactions: boolean;
    error: Error | null;
}
