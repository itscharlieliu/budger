import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { GenericDataAction, IMPORT_DATA_SUCCESS, IMPORTING_DATA } from "./dataInterfaces";
import ApplicationState from "../index";
import Papa, { ParseConfig } from "papaparse";

export type GenericDataThunkAction = ThunkAction<Promise<GenericDataAction>, ApplicationState, null, GenericDataAction>;

export const importData = (blob: File): GenericDataThunkAction => {
    return async (dispatch: ThunkDispatch<ApplicationState, null, GenericDataAction>): Promise<GenericDataAction> => {
        dispatch({ type: IMPORTING_DATA });

        const config: ParseConfig = {
            complete: (results: unknown) => console.log(results),
        };

        await Papa.parse(blob, config);

        return dispatch({ type: IMPORT_DATA_SUCCESS });
    };
};
