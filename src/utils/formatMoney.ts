const formatMoney = (value: string, decimals: number): string => {
    const stringValue = parseFloat(value);
    if (isNaN(stringValue)) {
        return "";
    }
    return stringValue.toFixed(decimals);
};

export default formatMoney;
