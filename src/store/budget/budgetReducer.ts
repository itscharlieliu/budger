import {
    ADD_CATEGORY_FAILURE,
    ADD_CATEGORY_SUCCESS,
    ADDING_CATEGORY,
    BudgetState,
    GenericBudgetAction,
    SET_TOTAL_BUDGET_FAILURE,
    SET_TOTAL_BUDGET_SUCCESS,
    SETTING_TOTAL_BUDGET,
    TotalBudget,
} from "./budgetInterfaces";

// TODO Remove this when done
const mockBudget: TotalBudget = [
    {
        group: "Group 1",
        categories: [
            {
                category: "Category 1",
                budgeted: 1000,
                activity: -320,
            },
            {
                category: "Category 2",
                budgeted: 2000,
                activity: -420,
            },
        ],
    },
    {
        group: "Group 2",
        categories: [
            {
                category: "Category 3",
                budgeted: 2500,
                activity: -320,
            },
            {
                category: "Category 4",
                budgeted: 20623,
                activity: -1420,
            },
        ],
    },
];

export const defaultBudgetState: BudgetState = {
    totalBudget: mockBudget,
    isSettingBudget: false,
    isAddingCategory: false,
    error: null,
};

const budgetReducer = (state: BudgetState = defaultBudgetState, action: GenericBudgetAction): BudgetState => {
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
        case ADDING_CATEGORY: {
            return { ...state, isAddingCategory: true };
        }
        case ADD_CATEGORY_SUCCESS: {
            return { ...state, isAddingCategory: false, totalBudget: action.totalBudget };
        }
        case ADD_CATEGORY_FAILURE: {
            return { ...state, isAddingCategory: false, error: action.error };
        }
        default: {
            return { ...state };
        }
    }
};

export default budgetReducer;
