import { combineReducers } from "redux";

import budgetReducer from "./budget/budgetReducer";
import initializationReducer from "./initialization/initializationReducer";
import transactionReducer from "./transactions/transactionReducer";

import ApplicationState from "./index";
import accountsReducer from "./accounts/accountsReducer";

const rootReducer = combineReducers<ApplicationState>({
    budget: budgetReducer,
    transaction: transactionReducer,
    initialization: initializationReducer,
    accounts: accountsReducer,
});

export default rootReducer;
