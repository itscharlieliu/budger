const getMonthCode = (date: Date): number => {
    return parseInt(`${date.getMonth().toString().padStart(2, "0")}}${date.getFullYear()}`);
};

export default getMonthCode;
