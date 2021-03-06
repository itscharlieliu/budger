import {
    getDateFromMonthCode,
    getMonthCodeFromDate,
    getMonthCodeString,
    getNextMonthCode,
    getPrevMonthCode,
    MonthCode,
    validateMonthCode,
} from "../getMonthCode";

describe("month code util tests", () => {
    it("can get month code from date", () => {
        const date = new Date(2020, 2);

        expect(getMonthCodeFromDate(date)).toEqual({ month: 2, year: 2020 });
    });

    it("can get date from month code", () => {
        const monthCode: MonthCode = {
            month: 2,
            year: 2020,
        };

        const date: Date = getDateFromMonthCode(monthCode);

        expect(date.getMonth()).toBe(2);
        expect(date.getFullYear()).toBe(2020);
    });

    it("validates month code", () => {
        const monthCode: MonthCode = {
            month: 2,
            year: 2020,
        };

        expect(validateMonthCode(monthCode)).toBe(true);

        const invalidMonthCode1: MonthCode = {
            month: 50,
            year: 2020,
        };

        expect(validateMonthCode(invalidMonthCode1)).toBe(false);

        const invalidMonthCode2: MonthCode = {
            month: 2,
            year: 100,
        };

        expect(validateMonthCode(invalidMonthCode2)).toBe(false);
    });

    it("is able to get next month", () => {
        let monthCode: MonthCode = {
            month: 2,
            year: 2020,
        };

        let nextMonth = getNextMonthCode(monthCode);

        expect(getMonthCodeString(nextMonth)).toBe("202003");

        // Test year rollover
        monthCode = {
            month: 11,
            year: 2020,
        };

        nextMonth = getNextMonthCode(monthCode);

        expect(getMonthCodeString(nextMonth)).toBe("202100");
    });

    it("is able to get previous month", () => {
        let monthCode: MonthCode = {
            month: 2,
            year: 2020,
        };

        let nextMonth = getPrevMonthCode(monthCode);

        expect(getMonthCodeString(nextMonth)).toBe("202001");

        // Test year rollover
        monthCode = {
            month: 0,
            year: 2020,
        };

        nextMonth = getPrevMonthCode(monthCode);

        expect(getMonthCodeString(nextMonth)).toBe("201911");
    });
});
