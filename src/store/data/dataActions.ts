import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { GenericDataAction, IMPORT_DATA_SUCCESS, IMPORTING_DATA } from "./dataInterfaces";
import ApplicationState from "../index";

export type GenericDataThunkAction = ThunkAction<Promise<GenericDataAction>, ApplicationState, null, GenericDataAction>;

export const importData = (blob: Blob): GenericDataThunkAction => {
    return async (dispatch: ThunkDispatch<ApplicationState, null, GenericDataAction>): Promise<GenericDataAction> => {
        dispatch({ type: IMPORTING_DATA });

        const reader = new FileReader();

        // TODO is this actually async?
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            const text = e && e.target && e.target.result;
            console.log(text);
        };

        reader.readAsText(blob);

        return dispatch({ type: IMPORT_DATA_SUCCESS });
    };
};
