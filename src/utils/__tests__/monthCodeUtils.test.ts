import getMonthCode, { MonthCode } from "../getMonthCode";

describe("month code util tests", () => {
    it("gets a month code from a date", () => {
        const date = new Date(2020, 2, 25);

        const monthCode = new MonthCode(date);

        expect(monthCode.toString()).toBe("202002");
    });

    it("is able to get next month", () => {
        let date = new Date(2020, 2, 25);

        let monthCode = new MonthCode(date);

        let nextMonth = monthCode.getNext();

        expect(nextMonth.toString()).toBe("202003");

        // Test year rollover
        date = new Date(2020, 11);

        monthCode = new MonthCode(date);

        nextMonth = monthCode.getNext();

        expect(nextMonth.toString()).toBe("202100");
    });

    it("is able to get previous month", () => {
        let date = new Date(2020, 2, 25);

        let monthCode = new MonthCode(date);

        let nextMonth = monthCode.getPrev();

        expect(nextMonth.toString()).toBe("202001");

        // Test year rollover
        date = new Date(2020, 0);

        monthCode = new MonthCode(date);

        nextMonth = monthCode.getPrev();

        expect(nextMonth.toString()).toBe("201911");
    });
});
