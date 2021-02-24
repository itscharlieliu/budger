import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { GenericDataAction, IMPORT_DATA_SUCCESS, ImportDataSuccessAction, IMPORTING_DATA } from "./dataInterfaces";
import ApplicationState from "../index";
import Papa, { ParseConfig, ParseResult } from "papaparse";
import { Transaction } from "../transactions/transactionInterfaces";

export type GenericDataThunkAction = ThunkAction<Promise<GenericDataAction>, ApplicationState, null, GenericDataAction>;

export const importTransactionData = (input: string | File | NodeJS.ReadableStream): GenericDataThunkAction => {
    return async (dispatch: ThunkDispatch<ApplicationState, null, GenericDataAction>): Promise<GenericDataAction> => {
        dispatch({ type: IMPORTING_DATA });

        return new Promise<GenericDataAction>((resolve: (value?: GenericDataAction) => void) => {
            const config: ParseConfig = {
                complete: (results: ParseResult<string[]>) => {
                    console.log(results);
                    // interface HeaderColumnsMap {
                    //     Account?: number;
                    //     Date?: number;
                    //     Payee?: number;
                    //     "Category Group"?: number;
                    //     Category?: number;
                    //     Memo?: number;
                    //     Outflow?: number;
                    //     Inflow?: number;
                    //
                    //     [other: string]: number | undefined;
                    // }
                    //
                    // const headerColumnsMap: HeaderColumnsMap = {};
                    //
                    // const newTransactions = results.data.reduce(
                    //     (previousValue: Transaction[], currentValue: string[], index: number): Transaction[] => {
                    //         // Parse header
                    //         if (index === 0) {
                    //             for (let columnIdx = 0; columnIdx < currentValue.length; ++columnIdx) {
                    //                 headerColumnsMap[currentValue[columnIdx]] = columnIdx;
                    //             }
                    //             return previousValue;
                    //         }
                    //
                    //         const newTransaction: Transaction = {
                    //             account: headerColumnsMap["Account"] ? currentValue[headerColumnsMap["Account"]] : undefined,
                    //             date: currentValue[headerColumnsMap["Date"]]
                    //         };
                    //
                    //         // previousValue.push(currentValue[0]);
                    //         return previousValue;
                    //     },
                    //     [],
                    // );
                    //
                    // console.log(newTransactions);
                    //
                    // resolve(dispatch({ type: IMPORT_DATA_SUCCESS }));
                },
            };

            Papa.parse(input, config);
        });
    };
};
