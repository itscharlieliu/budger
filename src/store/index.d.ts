import { BudgetState } from "./budget/budgetInterfaces";
import { TransactionState } from "./transactions/transactionInterfaces";

export default interface ApplicationState {
    budget: BudgetState;
    transaction: TransactionState;
}
