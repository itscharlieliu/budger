// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// We need to add ts-nocheck here because we are purposefully using an unknown type to check if json parsed correctly

const validateTotalBudget = (totalBudget: unknown): boolean => {
    if (typeof totalBudget !== "object") {
        return false;
    }

    try {
        for (const month of Object.keys(totalBudget)) {
            if (typeof month !== "string") {
                return false;
            }

            if (typeof totalBudget[month] !== "object") {
                return false;
            }

            for (const group of Object.keys(totalBudget[month])) {
                if (typeof group !== "string") {
                    return false;
                }

                if (typeof totalBudget[month][group] !== "object") {
                    return false;
                }

                for (const category of Object.keys(totalBudget[month][group])) {
                    if (typeof category !== "string") {
                        return false;
                    }

                    if (typeof totalBudget[month][group][category] !== "object") {
                        return false;
                    }

                    if (typeof totalBudget[month][group][category].budgeted !== "number") {
                        return false;
                    }

                    if (typeof totalBudget[month][group][category].activity !== "number") {
                        return false;
                    }
                }
            }
        }
        return true;
    } catch (e) {
        return false;
    }
};

export default validateTotalBudget;
