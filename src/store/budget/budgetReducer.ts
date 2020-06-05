import {
    IBudgetState,
    SET_TOTAL_BUDGET_FAILURE,
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
    TGenericBudgetAction,
} from "./budgetInterfaces";

// // TODO Remove this when done
// const mockBudget:

export const defaultBudgetState: IBudgetState = {
    totalBudget: [],
    isSettingBudget: false,
    error: null,
};

const budgetReducer = (state: IBudgetState = defaultBudgetState, action: TGenericBudgetAction): IBudgetState => {
    switch (action.type) {
        case SETTING_TOTAL_BUDGET: {
            return { ...state, isSettingBudget: true, error: null };
        }
        case SET_TOTAL_BUDGET_SUCCESS: {
            return { ...state, isSettingBudget: false, totalBudget: action.totalBudget };
        }
        case SET_TOTAL_BUDGET_FAILURE: {
            return { ...state, isSettingBudget: false, error: action.error };
        }
        default: {
            return { ...state };
        }
    }
};

export default budgetReducer;
