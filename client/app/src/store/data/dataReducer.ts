import {
    DataState,
    GenericDataAction,
    IMPORT_DATA_FAILURE,
    IMPORT_DATA_SUCCESS,
    IMPORTING_DATA,
} from "./dataInterfaces";

export const defaultDataState: DataState = {
    isImportingData: false,
    error: null,
};

const dataReducer = (state: DataState = defaultDataState, action: GenericDataAction): DataState => {
    switch (action.type) {
        case IMPORTING_DATA: {
            return { ...state, isImportingData: true };
        }
        case IMPORT_DATA_SUCCESS: {
            return { ...state, isImportingData: false };
        }
        case IMPORT_DATA_FAILURE: {
            return { ...state, isImportingData: false, error: action.error };
        }
        default: {
            return { ...state };
        }
    }
};

export default dataReducer;
