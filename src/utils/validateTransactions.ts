const validateTransactions = (transactions: unknown): boolean => {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        for (const transaction of transactions) {
            if (typeof transaction.account !== "string") {
                return false;
            }
            if (isNaN(transaction.date.getDate())) {
                return false;
            }
            if (typeof transaction.payee !== "string") {
                return false;
            }
            if (typeof transaction.category !== "string" && transaction.category !== undefined) {
                return false;
            }
            if (transaction.note !== undefined && typeof transaction.note !== "string") {
                return false;
            }
            if (typeof transaction.activity !== "number") {
                return false;
            }
        }
        return true;
    } catch (e) {
        return false;
    }
};

export default validateTransactions;
