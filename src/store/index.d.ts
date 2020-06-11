import { BudgetState } from "./budget/budgetInterfaces";
import { TransactionState } from "./transactions/transactionInterfaces";
import { InitializationState } from "./initialization/initializationInterfaces";

export default interface ApplicationState {
    budget: BudgetState;
    transaction: TransactionState;
    initialization: InitializationState;
}
