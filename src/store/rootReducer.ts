import { combineReducers } from "redux";

import budgetReducer from "./budget/budgetReducer";
import transactionReducer from "./transactions/transactionReducer";

const rootReducer = combineReducers({
    budget: budgetReducer,
    transaction: transactionReducer,
});

export default rootReducer;
