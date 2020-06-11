import { BudgetState } from "./budget/budgetInterfaces";
import { InitializationState } from "./initialization/initializationInterfaces";
import { TransactionState } from "./transactions/transactionInterfaces";

export default interface ApplicationState {
    budget: BudgetState;
    transaction: TransactionState;
    initialization: InitializationState;
}
