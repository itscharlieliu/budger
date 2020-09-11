import {
    SET_BUDGET_INITIALIZED_SUCCESS,
    SetBudgetInitializedSuccessAction,
} from "../initialization/initializationInterfaces";

import {
    ADD_MONTHLY_BUDGET_FAILURE,
    ADD_MONTHLY_BUDGET_SUCCESS,
    ADDING_MONTHLY_BUDGET,
    BudgetState,
    GenericBudgetAction,
    SET_TOTAL_BUDGET_FAILURE,
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
} from "./budgetInterfaces";

export const defaultBudgetState: BudgetState = {
    totalBudget: {},
    isSettingBudget: false,
    isAddingMonthlyBudget: false,
    error: null,
};

const budgetReducer = (
    state: BudgetState = defaultBudgetState,
    action: GenericBudgetAction | SetBudgetInitializedSuccessAction,
): BudgetState => {
    switch (action.type) {
        case SET_BUDGET_INITIALIZED_SUCCESS: {
            return { ...state, totalBudget: action.totalBudget };
        }
        case SETTING_TOTAL_BUDGET: {
            return { ...state, isSettingBudget: true, error: null };
        }
        case SET_TOTAL_BUDGET_SUCCESS: {
            return { ...state, isSettingBudget: false, totalBudget: action.totalBudget };
        }
        case SET_TOTAL_BUDGET_FAILURE: {
            return { ...state, isSettingBudget: false, error: action.error };
        }
        case ADDING_MONTHLY_BUDGET: {
            return { ...state, isAddingMonthlyBudget: true, error: null };
        }
        case ADD_MONTHLY_BUDGET_SUCCESS: {
            return { ...state, isAddingMonthlyBudget: false, totalBudget: action.totalBudget };
        }
        case ADD_MONTHLY_BUDGET_FAILURE: {
            return { ...state, isAddingMonthlyBudget: false, error: action.error };
        }
        default: {
            return { ...state };
        }
    }
};

export default budgetReducer;
