import { combineReducers } from "redux";

import accountsReducer from "./accounts/accountsReducer";
import authReducer from "./auth/authReducer";
import budgetReducer from "./budget/budgetReducer";
import initializationReducer from "./initialization/initializationReducer";
import transactionReducer from "./transactions/transactionReducer";

import ApplicationState from "./index";
import dataReducer from "./data/dataReducer";

const rootReducer = combineReducers<ApplicationState>({
    budget: budgetReducer,
    transaction: transactionReducer,
    initialization: initializationReducer,
    accounts: accountsReducer,
    data: dataReducer,
    auth: authReducer,
});

export default rootReducer;
