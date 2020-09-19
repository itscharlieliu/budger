import { TotalBudget } from "../../store/budget/budgetInterfaces";
import validateTotalBudget from "../validateTotalBudget";

const MONTH_CODE = "202009";

describe("total budget validator", () => {
    it("returns true if object is a valid total budget", () => {
        let validTotalBudget: TotalBudget = {
            [MONTH_CODE]: {
                "test group": {
                    "test category": {
                        budgeted: 0,
                        activity: 10,
                    },
                },
            },
        };

        expect(validateTotalBudget(validTotalBudget)).toBe(true);

        validTotalBudget = {
            [MONTH_CODE]: {
                "test group": {},
            },
        };

        expect(validateTotalBudget(validTotalBudget)).toBe(true);

        validTotalBudget = {
            [MONTH_CODE]: {},
        };

        expect(validateTotalBudget(validTotalBudget)).toBe(true);

        validTotalBudget = {};

        expect(validateTotalBudget(validTotalBudget)).toBe(true);
    });

    it("returns false if object is not a valid total budget", () => {
        const invalidTotalBudget1 = [
            {
                group: null,
                categories: [
                    {
                        category: "test category",
                        budgeted: 50,
                        activity: -10,
                    },
                ],
            },
        ];

        expect(validateTotalBudget(invalidTotalBudget1)).toBe(false);

        const invalidTotalBudget2 = {
            "test group": {
                "test category": {
                    budgeted: 0,
                    activity: 10,
                },
            },
        };

        expect(validateTotalBudget(invalidTotalBudget2)).toBe(false);

        const invalidTotalBudget3 = {
            [MONTH_CODE]: {
                "test group": {
                    "test category": {
                        budgeted: "s",
                        activity: 10,
                    },
                },
            },
        };

        expect(validateTotalBudget(invalidTotalBudget3)).toBe(false);

        const invalidTotalBudget5 = "test";

        expect(validateTotalBudget(invalidTotalBudget5)).toBe(false);

        const invalidTotalBudget6 = undefined;

        expect(validateTotalBudget(invalidTotalBudget6)).toBe(false);
    });
});
