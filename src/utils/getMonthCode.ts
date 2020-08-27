const getMonthCode = (date: Date): string => {
    return `${date.getMonth().toString().padStart(2, "0")}}${date.getFullYear()}`;
};

export default getMonthCode;
