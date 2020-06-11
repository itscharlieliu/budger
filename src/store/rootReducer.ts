import { combineReducers } from "redux";

import budgetReducer from "./budget/budgetReducer";
import transactionReducer from "./transactions/transactionReducer";
import initializationReducer from "./initialization/initializationReducer";

const rootReducer = combineReducers({
    budget: budgetReducer,
    transaction: transactionReducer,
    initialization: initializationReducer,
});

export default rootReducer;
