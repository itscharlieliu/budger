import { Action } from "redux";

export const IMPORTING_DATA = "IMPORTING_DATA";
export const IMPORT_DATA_SUCCESS = "IMPORT_DATA_SUCCESS";
export const IMPORT_DATA_FAILURE = "IMPORT_DATA_FAILURE";

export interface DataState {
    isImportingData: boolean;
    error: Error | null;
}

export interface ImportingDataAction extends Action<typeof IMPORTING_DATA> {}

export interface ImportDataSuccessAction extends Action<typeof IMPORT_DATA_SUCCESS> {}

export interface ImportDataFailureAction extends Action<typeof IMPORT_DATA_FAILURE> {
    error: Error;
}

export type GenericImportDataAction = ImportingDataAction | ImportDataSuccessAction | ImportDataFailureAction;

export type GenericDataAction = GenericImportDataAction;
