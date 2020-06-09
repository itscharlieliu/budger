import { ThunkAction } from "redux-thunk";
import ApplicationState from "../index";
import { GenericBudgetAction } from "../budget/budgetInterfaces";

export type GenericTransactionThunkAction = ThunkAction<Promise<void>, ApplicationState, null, GenericBudgetAction>;
