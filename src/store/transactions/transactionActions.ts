import { ThunkAction } from "redux-thunk";

import { GenericBudgetAction } from "../budget/budgetInterfaces";
import ApplicationState from "../index";

export type GenericTransactionThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericBudgetAction>;
