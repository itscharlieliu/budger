const formatMoney = (value: string | number, decimals: number): string => {
    const stringValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(stringValue)) {
        return "";
    }
    return stringValue.toFixed(decimals);
};

export default formatMoney;
