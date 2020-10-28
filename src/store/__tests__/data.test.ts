import dataReducer from "../data/dataReducer";
import { IMPORT_DATA_FAILURE, IMPORT_DATA_SUCCESS, IMPORTING_DATA } from "../data/dataInterfaces";

describe("data reducer", () => {
    it("keeps track of import status", () => {
        const dataState = dataReducer(undefined, { type: IMPORTING_DATA });
        expect(dataState.isImportingData).toEqual(true);

        const successDataState = dataReducer(dataState, { type: IMPORT_DATA_SUCCESS });
        expect(successDataState.isImportingData).toEqual(false);

        const error = new Error("test error");
        const failureDataState = dataReducer(dataState, { type: IMPORT_DATA_FAILURE, error });
        expect(failureDataState.isImportingData).toEqual(false);
        expect(failureDataState.error).toEqual(error);
    });
});
