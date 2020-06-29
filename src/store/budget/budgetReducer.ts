import {
    ADD_BUDGET_GROUP_FAILURE,
    ADD_BUDGET_GROUP_SUCCESS,
    ADDING_BUDGET_GROUP,
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
    isAddingBudgetGroup: false,
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
        case ADDING_BUDGET_GROUP: {
            return { ...state, isAddingBudgetGroup: true };
        }
        case ADD_BUDGET_GROUP_SUCCESS: {
            return { ...state, isAddingBudgetGroup: false, totalBudget: action.totalBudget };
        }
        case ADD_BUDGET_GROUP_FAILURE: {
            return { ...state, isAddingBudgetGroup: false, error: action.error };
        }
        default: {
            return { ...state };
        }
    }
};

export default budgetReducer;
