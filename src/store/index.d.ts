import { AccountsState } from "./accounts/accountsInterfaces";
import { BudgetState } from "./budget/budgetInterfaces";
import { InitializationState } from "./initialization/initializationInterfaces";
import { TransactionState } from "./transactions/transactionInterfaces";
import { DataState } from "./data/dataInterfaces";

export default interface ApplicationState {
    budget: BudgetState;
    transaction: TransactionState;
    initialization: InitializationState;
    accounts: AccountsState;
    data: DataState;
}
