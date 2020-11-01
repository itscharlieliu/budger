import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { GenericDataAction, IMPORT_DATA_SUCCESS, ImportDataSuccessAction, IMPORTING_DATA } from "./dataInterfaces";
import ApplicationState from "../index";
import Papa, { ParseConfig, ParseResult } from "papaparse";

export type GenericDataThunkAction = ThunkAction<Promise<GenericDataAction>, ApplicationState, null, GenericDataAction>;

export const importTransactionData = (blob: File): GenericDataThunkAction => {
    return async (dispatch: ThunkDispatch<ApplicationState, null, GenericDataAction>): Promise<GenericDataAction> => {
        dispatch({ type: IMPORTING_DATA });

        return new Promise<GenericDataAction>((resolve: (value?: GenericDataAction) => void) => {
            const config: ParseConfig = {
                complete: (results: ParseResult<string[]>) => {
                    console.log(results);

                    for (const row of results.data) {
                        console.log(row);
                    }

                    resolve(dispatch({ type: IMPORT_DATA_SUCCESS }));
                },
            };

            Papa.parse(blob, config);
        });
    };
};
