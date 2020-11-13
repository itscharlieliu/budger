import dataReducer from "../data/dataReducer";
import { IMPORT_DATA_FAILURE, IMPORT_DATA_SUCCESS, IMPORTING_DATA } from "../data/dataInterfaces";
import thunk, { ThunkDispatch } from "redux-thunk";
import ApplicationState from "../index";
import { AnyAction } from "redux";
import configureMockStore from "redux-mock-store";
import { importTransactionData } from "../data/dataActions";

type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>;

const mockStore = configureMockStore<unknown, Dispatch>([thunk]);

describe("data actions", () => {
    it("imports transactions data", async () => {
        /* eslint-disable */
        const MOCK_TRANSACTIONS_DATA =
            '"Account","Flag","Date","Payee","Category Group/Category","Category Group","Category","Memo","Outflow","Inflow","Cleared"\n' +
            '"BofA Checkings","","10/29/2020","Transfer : Ally Savings","","","","",$1000.00,$0.00,"Uncleared"\n' +
            '"BofA Checkings","","10/29/2020","Apple","Inflow: To be Budgeted","Inflow","To be Budgeted","",$0.00,$6.34,"Uncleared"\n' +
            '"Ally Savings","","10/29/2020","Transfer : BofA Checkings","","","","",$0.00,$1000.00,"Uncleared"\n' +
            '"Amex Gold","","10/28/2020","Pho Hoan Pasteur","Just for Fun: Dining Out","Just for Fun","Dining Out","",$23.15,$0.00,"Uncleared"\n' +
            '"Chase Checkings","","10/27/2020","Allure","Immediate Obligations: Water/Trash","Immediate Obligations","Water/Trash","Split (1/2) ",$54.02,$0.00,"Cleared"\n' +
            '"Chase Checkings","","10/27/2020","Allure","Immediate Obligations: Rent/Mortgage","Immediate Obligations","Rent/Mortgage","Split (2/2) ",$1789.00,$0.00,"Cleared"\n' +
            '"Apple Card","","10/27/2020","Apple","Quality of Life Goals: Computer Replacement","Quality of Life Goals","Computer Replacement","",$41.58,$0.00,"Reconciled"\n' +
            '"BofA Checkings","","10/26/2020","Transfer : BofA Cash Rewards","","","","",$157.38,$0.00,"Reconciled"\n' +
            '"BofA Cash Rewards","","10/26/2020","Transfer : BofA Checkings","","","","",$0.00,$157.38,"Reconciled"\n' +
            '"Chase Checkings","","10/26/2020","The Chicken Rice","Just for Fun: Dining Out","Just for Fun","Dining Out","Split (1/10) ",$0.00,$23.20,"Cleared"\n' +
            '"Chase Checkings","","10/26/2020","Bay Poke","Just for Fun: Dining Out","Just for Fun","Dining Out","Split (2/10) ",$0.00,$6.80,"Cleared"\n' +
            '"Chase Checkings","","10/26/2020","The Chicken Rice","Just for Fun: Dining Out","Just for Fun","Dining Out","Split (3/10) ",$0.00,$22.20,"Cleared"\n' +
            '"Chase Checkings","","10/26/2020","Target","Just for Fun: Fun Money","Just for Fun","Fun Money","Split (4/10) ",$0.00,$16.63,"Cleared"\n' +
            '"Chase Checkings","","10/26/2020","Urban Seoul","Just for Fun: Dining Out","Just for Fun","Dining Out","Split (5/10) ",$0.00,$19.74,"Cleared"\n' +
            '"Chase Checkings","","10/26/2020","Ralphs","Immediate Obligations: Groceries","Immediate Obligations","Groceries","Split (6/10) ",$0.00,$0.00,"Cleared"\n' +
            '"Chase Checkings","","10/26/2020","Oliboli Donuts","Just for Fun: Dining Out","Just for Fun","Dining Out","Split (7/10) ",$0.00,$13.37,"Cleared"\n' +
            '"Chase Checkings","","10/26/2020","Trader Joes","Immediate Obligations: Groceries","Immediate Obligations","Groceries","Split (8/10) ",$0.00,$30.28,"Cleared"';
        /* eslint-enable */

        // TODO
        const store = mockStore({});

        await store.dispatch(importTransactionData(MOCK_TRANSACTIONS_DATA));
        const actions = store.getActions();

        console.log(actions);
    });
});

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
