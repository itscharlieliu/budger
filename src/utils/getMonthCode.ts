import ERRORS from "../defs/errors";

const MONTHCODE_SEPERATOR = "_";

const END_MONTH = 11;

const getMonthCode = (date: Date): string => {
    return `${date.getFullYear()}${MONTHCODE_SEPERATOR}${date.getMonth().toString().padStart(2, "0")}`;
};

export const isValidMonthCode = (monthCode: string) => {
    const parsedCode = monthCode.split(MONTHCODE_SEPERATOR);

    if (parsedCode.length !== 2) {
        // We know right away that it is not valid if the length is not 2
        return false;
    }

    if (isNaN(parseInt(parsedCode[0]))) {
        // Return false if year is not a number
        return false;
    }

    if (isNaN(parseInt(parsedCode[1]))) {
        // Return false if month is not a number
        return false;
    }

    return true;
};

export const getNextMonthCode = (monthCode: string): string => {
    if (!isValidMonthCode(monthCode)) {
        throw new Error(ERRORS.invalidMonthCode);
    }

    const parsedCode = monthCode.split(MONTHCODE_SEPERATOR);

    const year = parseInt(parsedCode[0]);
    const month = parseInt(parsedCode[1]);

    if (month < END_MONTH) {
        return `${year}_${month + 1}`;
    }
    return `${year + 1}_00`;
};

export const getPrevMonthCode = (monthCode: string): string => {
    if (!isValidMonthCode(monthCode)) {
        throw new Error(ERRORS.invalidMonthCode);
    }

    const parsedCode = monthCode.split(MONTHCODE_SEPERATOR);

    const year = parseInt(parsedCode[0]);
    const month = parseInt(parsedCode[1]);

    if (month > 0) {
        return `${year}_${month - 1}`;
    }
    return `${year - 1}_${END_MONTH}`;
};

export default getMonthCode;
