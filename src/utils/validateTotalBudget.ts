const validateTotalBudget = (totalBudget: unknown): boolean => {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        for (const group of totalBudget) {
            if (typeof group.group !== "string") {
                return false;
            }
            for (const category of group.categories) {
                if (typeof category.category !== "string") {
                    return false;
                }
                if (typeof category.budgeted !== "number") {
                    return false;
                }
                if (typeof category.activity !== "number") {
                    return false;
                }
            }
        }
        return true;
    } catch (e) {
        return false;
    }
};

export default validateTotalBudget;
