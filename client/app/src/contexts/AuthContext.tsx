import { API_URL } from "@/defs/urls";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
    id: number;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    name: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface ApiError {
    success: false;
    error: string;
    message?: string;
}

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    restoreUserSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
    });

    const login = async (credentials: LoginCredentials) => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.success) {
                // Store token in localStorage
                localStorage.setItem("budger_token", data.data.token);
                localStorage.setItem("budger_user", JSON.stringify(data.data.user));

                setState((prev) => ({
                    ...prev,
                    user: data.data.user,
                    token: data.data.token,
                    isLoading: false,
                    error: null,
                    isAuthenticated: true,
                }));
            } else {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: data.error || "Login failed",
                    isAuthenticated: false,
                }));
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: "Network error. Please try again.",
                isAuthenticated: false,
            }));
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch("http://localhost:3001/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.success) {
                // Store token in localStorage
                localStorage.setItem("budger_token", data.data.token);
                localStorage.setItem("budger_user", JSON.stringify(data.data.user));

                setState((prev) => ({
                    ...prev,
                    user: data.data.user,
                    token: data.data.token,
                    isLoading: false,
                    error: null,
                    isAuthenticated: true,
                }));
            } else {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: data.error || "Registration failed",
                    isAuthenticated: false,
                }));
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: "Network error. Please try again.",
                isAuthenticated: false,
            }));
        }
    };

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem("budger_token");
        localStorage.removeItem("budger_user");

        setState((prev) => ({
            ...prev,
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        }));
    };

    const clearError = () => {
        setState((prev) => ({ ...prev, error: null }));
    };

    const restoreUserSession = () => {
        const token = localStorage.getItem("budger_token");
        const userStr = localStorage.getItem("budger_user");

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                setState((prev) => ({
                    ...prev,
                    user,
                    token,
                    isAuthenticated: true,
                    error: null,
                }));
            } catch (error) {
                // Clear invalid data
                localStorage.removeItem("budger_token");
                localStorage.removeItem("budger_user");
            }
        }
    };

    // Restore session on mount
    useEffect(() => {
        restoreUserSession();
    }, []);

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        restoreUserSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
