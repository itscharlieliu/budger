const MIN_MONTH = 0;
const MAX_MONTH = 11;

// I would be surprised if this app is still being used in the year 2999
const MIN_YEAR = 2000;
const MAX_YEAR = 2999;

export interface MonthCode {
    month: number;
    year: number;
}

export const getNextMonthCode = (monthCode: MonthCode): MonthCode => {
    const nextMonthCodeDate = new Date(monthCode.year, monthCode.month + 1);

    return { month: nextMonthCodeDate.getMonth(), year: nextMonthCodeDate.getFullYear() };
};

export const getPrevMonthCode = (monthCode: MonthCode): MonthCode => {
    const nextMonthCodeDate = new Date(monthCode.year, monthCode.month - 1);

    return { month: nextMonthCodeDate.getMonth(), year: nextMonthCodeDate.getFullYear() };
};

export const getMonthCodeString = (monthCode: MonthCode): string => {
    return `${monthCode.year}${monthCode.month.toString().padStart(2, "0")}`;
};

export const validateMonthCode = (monthCode: MonthCode): boolean => {
    if (isNaN(monthCode.month)) {
        return false;
    }

    if (monthCode.month > MAX_MONTH || monthCode.month < MIN_MONTH) {
        return false;
    }

    if (isNaN(monthCode.year)) {
        return false;
    }

    return !(monthCode.year > MAX_YEAR || monthCode.year < MIN_YEAR);
};
