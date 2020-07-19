import validateTotalBudget from "../validateTotalBudget";

describe("total budget validator", () => {
    it("returns true if object is a valid total budget", () => {
        let validTotalBudget = [
            {
                group: "test group",
                categories: [
                    {
                        category: "test category",
                        budgeted: 50,
                        activity: -10,
                    },
                ],
            },
        ];

        expect(validateTotalBudget(validTotalBudget)).toBe(true);

        validTotalBudget = [
            {
                group: "test group",
                categories: [],
            },
        ];

        expect(validateTotalBudget(validTotalBudget)).toBe(true);

        validTotalBudget = [];

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

        const invalidTotalBudget2 = [
            {
                group: "test category",
                categories: [
                    {
                        category: "test category",
                        budgeted: "50",
                        activity: -10,
                    },
                ],
            },
        ];

        expect(validateTotalBudget(invalidTotalBudget2)).toBe(false);

        const invalidTotalBudget3 = [
            {
                group: "test category",
                categories: [null],
            },
        ];

        expect(validateTotalBudget(invalidTotalBudget3)).toBe(false);

        const invalidTotalBudget4 = "test";

        expect(validateTotalBudget(invalidTotalBudget4)).toBe(false);

        const invalidTotalBudget5 = undefined;

        expect(validateTotalBudget(invalidTotalBudget5)).toBe(false);
    });
});
