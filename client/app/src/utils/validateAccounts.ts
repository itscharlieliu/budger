import { AccountType } from "../store/accounts/accountsInterfaces";

const validateAccounts = (accounts: unknown): boolean => {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        for (const account of accounts) {
            if (typeof account.name !== "string") {
                return false;
            }
            if (AccountType[account.type] === undefined) {
                return false;
            }
        }
        return true;
    } catch (e) {
        return false;
    }
};

export default validateAccounts;
