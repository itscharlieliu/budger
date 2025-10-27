import AppLayout from "../src/components/AppLayout";
import ProtectedRoute from "../src/components/ProtectedRoute";
import TransactionsScreen from "../src/components/screens/TransactionsScreen";

export default function TransactionsPage() {
    return (
        <ProtectedRoute>
            <AppLayout>
                <TransactionsScreen />
            </AppLayout>
        </ProtectedRoute>
    );
}
