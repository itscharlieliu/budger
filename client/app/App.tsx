import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import AccountsScreen from "./pages/AccountsScreen";
import TransactionsScreen from "./pages/TransactionsScreen";
import { ACCOUNTS, TRANSACTIONS } from "./defs/routerPaths";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/accounts" element={<AccountsScreen />} />
                <Route path="/transactions" element={<TransactionsScreen />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
