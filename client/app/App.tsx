import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import BudgetScreen from "./pages/BudgetScreen";
import AccountsScreen from "./pages/AccountsScreen";
import TransactionsScreen from "./pages/TransactionsScreen";
import { BUDGET, ACCOUNTS, TRANSACTIONS } from "./defs/routerPaths";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/budget" element={<BudgetScreen />} />
                <Route path="/accounts" element={<AccountsScreen />} />
                <Route path="/transactions" element={<TransactionsScreen />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
