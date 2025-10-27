import AppLayout from "../src/components/AppLayout";
import ProtectedRoute from "../src/components/ProtectedRoute";
import AccountScreens from "../src/components/screens/AccountsScreen";

export default function AccountsPage() {
    return (
        <ProtectedRoute>
            <AppLayout>
                <AccountScreens />
            </AppLayout>
        </ProtectedRoute>
    );
}
