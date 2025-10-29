import { useState, useEffect, useCallback } from "react";
import { BUDGET, TO_BE_BUDGETED } from "../defs/storageKeys";
import { getMonthCodeString, MonthCode } from "../utils/getMonthCode";
import { TotalBudget, BudgetCategory, MonthlyBudget, BudgetGroup } from "../store/budget/budgetInterfaces";
import validateTotalBudget from "../utils/validateTotalBudget";

export interface UseBudgetReturn {
    totalBudget: TotalBudget;
    toBeBudgeted: number;
    isLoading: boolean;
    error: string | null;
    addBudgetMonth: (monthCode: MonthCode) => void;
    deleteBudgetCategory: (monthCode: MonthCode, budgetCategory: string) => void;
    deleteBudgetGroup: (monthCode: MonthCode, budgetGroup: string) => void;
    copyBudgetMonth: (fromMonthCode: MonthCode, toMonthCode: MonthCode) => void;
    addBudgetGroup: (monthCode: MonthCode, budgetGroup: string) => void;
    addBudgetCategory: (monthCode: MonthCode, budgetGroup: string, budgetCategory: string) => void;
    editBudgetedAmount: (monthCode: MonthCode, budgetCategory: string, budgeted: number) => void;
    setToBeBudgetedAmount: (toBeBudgeted: number | ((currToBeBudgeted: number) => number)) => void;
    setActivityAmount: (
        monthCode: MonthCode,
        budgetCategory: string,
        activity: number | ((currActivity: number) => number),
    ) => void;
}

export const useBudget = (): UseBudgetReturn => {
    const [totalBudget, setTotalBudget] = useState<TotalBudget>({});
    const [toBeBudgeted, setToBeBudgeted] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load budget data from localStorage on mount
    useEffect(() => {
        try {
            const totalBudgetJson = localStorage.getItem(BUDGET);
            const totalBudget: TotalBudget = totalBudgetJson ? JSON.parse(totalBudgetJson) : {};

            if (!validateTotalBudget(totalBudget)) {
                setError("Invalid budget data");
                return;
            }

            const toBeBudgetedJson = localStorage.getItem(TO_BE_BUDGETED);
            const toBeBudgeted = toBeBudgetedJson ? JSON.parse(toBeBudgetedJson) : 0;

            setTotalBudget(totalBudget);
            setToBeBudgeted(toBeBudgeted);
        } catch (error) {
            setError("Failed to load budget data");
        }
    }, []);

    const saveBudget = useCallback((newTotalBudget: TotalBudget) => {
        localStorage.setItem(BUDGET, JSON.stringify(newTotalBudget));
        setTotalBudget(newTotalBudget);
    }, []);

    const saveToBeBudgeted = useCallback((newToBeBudgeted: number) => {
        localStorage.setItem(TO_BE_BUDGETED, JSON.stringify(newToBeBudgeted));
        setToBeBudgeted(newToBeBudgeted);
    }, []);

    const addBudgetMonth = useCallback(
        (monthCode: MonthCode) => {
            setIsLoading(true);
            setError(null);

            try {
                const monthCodeString = getMonthCodeString(monthCode);

                if (totalBudget[monthCodeString]) {
                    setError("Month already exists");
                    return;
                }

                const newTotalBudget = { ...totalBudget, [monthCodeString]: {} };
                saveBudget(newTotalBudget);
            } catch (error) {
                setError("Failed to add budget month");
            } finally {
                setIsLoading(false);
            }
        },
        [totalBudget, saveBudget],
    );

    const deleteBudgetCategory = useCallback(
        (monthCode: MonthCode, budgetCategory: string) => {
            setIsLoading(true);
            setError(null);

            try {
                const monthCodeString = getMonthCodeString(monthCode);
                const newMonthlyBudget: MonthlyBudget = { ...totalBudget[monthCodeString] };

                let numCategoriesDeleted = 0;

                for (const group of Object.keys(newMonthlyBudget)) {
                    if (newMonthlyBudget[group][budgetCategory] !== undefined) {
                        delete newMonthlyBudget[group][budgetCategory];
                        ++numCategoriesDeleted;
                    }
                }

                if (numCategoriesDeleted === 0) {
                    setError("Category does not exist");
                    return;
                }

                const newTotalBudget = { ...totalBudget, [monthCodeString]: newMonthlyBudget };
                saveBudget(newTotalBudget);
            } catch (error) {
                setError("Failed to delete budget category");
            } finally {
                setIsLoading(false);
            }
        },
        [totalBudget, saveBudget],
    );

    const deleteBudgetGroup = useCallback(
        (monthCode: MonthCode, budgetGroup: string) => {
            setIsLoading(true);
            setError(null);

            try {
                const monthCodeString = getMonthCodeString(monthCode);

                if (!totalBudget[monthCodeString]) {
                    setError("Month does not exist");
                    return;
                }

                if (!totalBudget[monthCodeString][budgetGroup]) {
                    setError("Group does not exist");
                    return;
                }

                const newTotalBudget = { ...totalBudget };
                delete newTotalBudget[monthCodeString][budgetGroup];
                saveBudget(newTotalBudget);
            } catch (error) {
                setError("Failed to delete budget group");
            } finally {
                setIsLoading(false);
            }
        },
        [totalBudget, saveBudget],
    );

    const copyBudgetMonth = useCallback(
        (fromMonthCode: MonthCode, toMonthCode: MonthCode) => {
            setIsLoading(true);
            setError(null);

            try {
                const sourceBudget = totalBudget[getMonthCodeString(fromMonthCode)];

                if (!sourceBudget) {
                    setError("Source month does not exist");
                    return;
                }

                const destBudget: MonthlyBudget = {};

                // Deep copy
                for (const group of Object.keys(sourceBudget)) {
                    const groupObject = sourceBudget[group];

                    const tempBudgetGroup: BudgetGroup = {};
                    for (const category of Object.keys(groupObject)) {
                        // Make sure to set activity to zero. We don't want to copy over the activity from the previous month
                        tempBudgetGroup[category] = {
                            budgeted: groupObject[category].budgeted,
                            activity: 0,
                        };
                    }

                    destBudget[group] = tempBudgetGroup;
                }

                const newTotalBudget = { ...totalBudget, [getMonthCodeString(toMonthCode)]: destBudget };
                saveBudget(newTotalBudget);
            } catch (error) {
                setError("Failed to copy budget month");
            } finally {
                setIsLoading(false);
            }
        },
        [totalBudget, saveBudget],
    );

    const addBudgetGroup = useCallback(
        (monthCode: MonthCode, budgetGroup: string) => {
            setIsLoading(true);
            setError(null);

            try {
                const monthCodeString = getMonthCodeString(monthCode);

                if (totalBudget[monthCodeString] === undefined) {
                    setError("Month does not exist");
                    return;
                }

                if (totalBudget[monthCodeString][budgetGroup] !== undefined) {
                    setError("Group already exists");
                    return;
                }

                const newMonthlyBudget = { ...totalBudget[monthCodeString], [budgetGroup]: {} };
                const newTotalBudget = { ...totalBudget, [monthCodeString]: newMonthlyBudget };
                saveBudget(newTotalBudget);
            } catch (error) {
                setError("Failed to add budget group");
            } finally {
                setIsLoading(false);
            }
        },
        [totalBudget, saveBudget],
    );

    const addBudgetCategory = useCallback(
        (monthCode: MonthCode, budgetGroup: string, budgetCategory: string) => {
            setIsLoading(true);
            setError(null);

            try {
                const monthCodeString = getMonthCodeString(monthCode);

                // Check if month exists
                if (!totalBudget[monthCodeString]) {
                    setError("Month does not exist");
                    return;
                }

                // Check if group exists
                if (!totalBudget[monthCodeString][budgetGroup]) {
                    setError("Group does not exist");
                    return;
                }

                // Check if category already exists in any group
                for (const group of Object.keys(totalBudget[monthCodeString])) {
                    if (totalBudget[monthCodeString][group][budgetCategory] !== undefined) {
                        setError("Category already exists");
                        return;
                    }
                }

                const newBudgetGroup = {
                    ...totalBudget[monthCodeString][budgetGroup],
                    [budgetCategory]: {
                        budgeted: 0,
                        activity: 0,
                    },
                };

                const newMonthlyBudget = { ...totalBudget[monthCodeString], [budgetGroup]: newBudgetGroup };
                const newTotalBudget = { ...totalBudget, [monthCodeString]: newMonthlyBudget };
                saveBudget(newTotalBudget);
            } catch (error) {
                setError("Failed to add budget category");
            } finally {
                setIsLoading(false);
            }
        },
        [totalBudget, saveBudget],
    );

    const editBudgetedAmount = useCallback(
        (monthCode: MonthCode, budgetCategory: string, budgeted: number) => {
            setIsLoading(true);
            setError(null);

            try {
                const monthCodeString = getMonthCodeString(monthCode);
                const newTotalBudget: TotalBudget = { ...totalBudget };

                if (!newTotalBudget[monthCodeString]) {
                    setError("Month does not exist");
                    return;
                }

                let numCategoriesEdited = 0;

                for (const group of Object.keys(newTotalBudget[monthCodeString])) {
                    if (newTotalBudget[monthCodeString][group][budgetCategory] !== undefined) {
                        newTotalBudget[monthCodeString][group][budgetCategory].budgeted = budgeted;
                        ++numCategoriesEdited;
                    }
                }

                if (numCategoriesEdited === 0) {
                    setError("Category does not exist");
                    return;
                }

                saveBudget(newTotalBudget);
            } catch (error) {
                setError("Failed to edit budgeted amount");
            } finally {
                setIsLoading(false);
            }
        },
        [totalBudget, saveBudget],
    );

    const setToBeBudgetedAmount = useCallback(
        (newToBeBudgeted: number | ((currToBeBudgeted: number) => number)) => {
            setIsLoading(true);
            setError(null);

            try {
                let finalToBeBudgeted = toBeBudgeted;

                if (typeof newToBeBudgeted === "function") {
                    finalToBeBudgeted = newToBeBudgeted(finalToBeBudgeted);
                } else {
                    finalToBeBudgeted = newToBeBudgeted;
                }

                saveToBeBudgeted(finalToBeBudgeted);
            } catch (error) {
                setError("Failed to set to be budgeted amount");
            } finally {
                setIsLoading(false);
            }
        },
        [toBeBudgeted, saveToBeBudgeted],
    );

    const setActivityAmount = useCallback(
        (monthCode: MonthCode, budgetCategory: string, activity: number | ((currActivity: number) => number)) => {
            setIsLoading(true);
            setError(null);

            try {
                const monthCodeString = getMonthCodeString(monthCode);
                const newTotalBudget: TotalBudget = { ...totalBudget };

                if (!newTotalBudget[monthCodeString]) {
                    setError("Month does not exist");
                    return;
                }

                let numCategoriesEdited = 0;

                for (const group of Object.keys(newTotalBudget[monthCodeString])) {
                    if (newTotalBudget[monthCodeString][group][budgetCategory] !== undefined) {
                        ++numCategoriesEdited;

                        if (typeof activity === "function") {
                            newTotalBudget[monthCodeString][group][budgetCategory].activity = activity(
                                newTotalBudget[monthCodeString][group][budgetCategory].activity,
                            );
                            continue;
                        }
                        newTotalBudget[monthCodeString][group][budgetCategory].activity = activity;
                    }
                }

                if (numCategoriesEdited === 0) {
                    setError("Category does not exist");
                    return;
                }

                saveBudget(newTotalBudget);
            } catch (error) {
                setError("Failed to set activity amount");
            } finally {
                setIsLoading(false);
            }
        },
        [totalBudget, saveBudget],
    );

    return {
        totalBudget,
        toBeBudgeted,
        isLoading,
        error,
        addBudgetMonth,
        deleteBudgetCategory,
        deleteBudgetGroup,
        copyBudgetMonth,
        addBudgetGroup,
        addBudgetCategory,
        editBudgetedAmount,
        setToBeBudgetedAmount,
        setActivityAmount,
    };
};
