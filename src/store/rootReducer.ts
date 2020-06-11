import { combineReducers } from "redux";

import budgetReducer from "./budget/budgetReducer";
import initializationReducer from "./initialization/initializationReducer";
import transactionReducer from "./transactions/transactionReducer";

const rootReducer = combineReducers({
    budget: budgetReducer,
    transaction: transactionReducer,
    initialization: initializationReducer,
});

export default rootReducer;
