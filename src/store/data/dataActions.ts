import { ThunkAction } from "redux-thunk";
import { GenericDataAction } from "./dataInterfaces";
import ApplicationState from "../index";

export type GenericDataThunkAction = ThunkAction<Promise<GenericDataAction>, ApplicationState, null, GenericDataAction>;

// export const importData = (
//
// )
