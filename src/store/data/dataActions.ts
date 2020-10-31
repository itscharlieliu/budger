import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { GenericDataAction, IMPORT_DATA_SUCCESS, ImportDataSuccessAction, IMPORTING_DATA } from "./dataInterfaces";
import ApplicationState from "../index";
import Papa, { ParseConfig } from "papaparse";

export type GenericDataThunkAction = ThunkAction<Promise<GenericDataAction>, ApplicationState, null, GenericDataAction>;

export const importData = (blob: File): GenericDataThunkAction => {
    return async (dispatch: ThunkDispatch<ApplicationState, null, GenericDataAction>): Promise<GenericDataAction> => {
        dispatch({ type: IMPORTING_DATA });

        return new Promise<GenericDataAction>((resolve) => {
            const config: ParseConfig = {
                complete: (results: unknown) => {
                    console.log(results);

                    resolve(dispatch({ type: IMPORT_DATA_SUCCESS }));
                },
            };

            Papa.parse(blob, config);
        });
    };
};
