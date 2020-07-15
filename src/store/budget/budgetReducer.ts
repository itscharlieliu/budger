import {
    ADD_BUDGET_CATEGORY_FAILURE,
    ADD_BUDGET_CATEGORY_SUCCESS,
    ADD_BUDGET_GROUP_FAILURE,
    ADD_BUDGET_GROUP_SUCCESS,
    ADDING_BUDGET_CATEGORY,
    ADDING_BUDGET_GROUP,
    BudgetState,
    GenericBudgetAction,
    SET_TOTAL_BUDGET_FAILURE,
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
} from "./budgetInterfaces";
import {
    SET_BUDGET_INITIALIZED_SUCCESS,
    SetBudgetInitializedSuccessAction,
} from "../initialization/initializationInterfaces";

export const defaultBudgetState: BudgetState = {
    totalBudget: [],
    isSettingBudget: false,
    isAddingBudgetGroup: false,
    isAddingBudgetCategory: false,
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
        case ADDING_BUDGET_GROUP: {
            return { ...state, isAddingBudgetGroup: true };
        }
        case ADD_BUDGET_GROUP_SUCCESS: {
            return { ...state, isAddingBudgetGroup: false, totalBudget: action.totalBudget };
        }
        case ADD_BUDGET_GROUP_FAILURE: {
            return { ...state, isAddingBudgetGroup: false, error: action.error };
        }
        case ADDING_BUDGET_CATEGORY: {
            return { ...state, isAddingBudgetCategory: true };
        }
        case ADD_BUDGET_CATEGORY_SUCCESS: {
            return { ...state, isAddingBudgetCategory: false, totalBudget: action.totalBudget };
        }
        case ADD_BUDGET_CATEGORY_FAILURE: {
            return { ...state, isAddingBudgetCategory: false, error: action.error };
        }
        default: {
            return { ...state };
        }
    }
};

export default budgetReducer;
