const getMonthCode = (date: Date): string => {
    return `${date.getFullYear()}${date.getMonth().toString().padStart(2, "0")}`;
};

export default getMonthCode;
