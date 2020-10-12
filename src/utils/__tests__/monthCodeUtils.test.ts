import getMonthCode, { MonthCode } from "../getMonthCode";

describe("month code util tests", () => {
    it("gets a month code from a date", () => {
        const date = new Date(2020, 2, 25);

        const monthCode = new MonthCode(date);

        expect(monthCode.toString()).toBe("202002");
    });

    it("is able to get next month", () => {
        const date = new Date(2020, 2, 25);

        const monthCode = new MonthCode(date);

        const nextMonth = monthCode.next();
    });
});
