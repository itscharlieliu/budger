import AppLayout from "../src/components/AppLayout";
import ProtectedRoute from "../src/components/ProtectedRoute";
import BudgetScreen from "../src/components/screens/BudgetScreen";

export default function BudgetPage() {
    return (
        <ProtectedRoute>
            <AppLayout>
                <BudgetScreen />
            </AppLayout>
        </ProtectedRoute>
    );
}
