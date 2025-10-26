import { Transaction } from "../../store/transactions/transactionInterfaces";
import validateTransactions from "../validateTransactions";

describe("transactions validator", () => {
    it("returns true if object is a valid total budget", () => {
        let validTransactions: Transaction[] = [
            {
                account: "Test acc",
                activity: -50,
                date: new Date(),
                note: "",
                payee: "Test",
            },
        ];

        expect(validateTransactions(validTransactions)).toBe(true);

        validTransactions = [
            {
                account: "Test acc2",
                activity: -50,
                date: new Date(),
                note: "",
                payee: "Test",
            },
        ];

        expect(validateTransactions(validTransactions)).toBe(true);

        validTransactions = [];

        expect(validateTransactions(validTransactions)).toBe(true);
    });
});
