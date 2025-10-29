import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { theme } from "../defs/theme";
import { useAuth, LoginCredentials, RegisterCredentials } from "../contexts/AuthContext";

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%);
`;

const LoginCard = styled.div`
    background: ${theme.palette.background.main};
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: ${theme.shadow.high};
`;

const Logo = styled.div`
    text-align: center;
    margin-bottom: 32px;

    h1 {
        color: ${theme.palette.primary.main};
        font-size: 2.5rem;
        font-weight: ${theme.font.weight.bold};
        margin: 0;
    }

    p {
        color: ${theme.palette.background.contrast};
        margin: 8px 0 0 0;
        font-size: 1rem;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ErrorMessage = styled.div`
    background: ${theme.palette.error.light};
    color: ${theme.palette.error.main};
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 8px;
`;

const ToggleMode = styled.div`
    text-align: center;
    margin-top: 20px;

    button {
        background: none;
        border: none;
        color: ${theme.palette.primary.main};
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: underline;

        &:hover {
            color: ${theme.palette.primary.dark};
        }
    }
`;

export default function LoginPage() {
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated, login, register } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/transactions");
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("Is login mode:", isLoginMode);

        e.preventDefault();
        if (isLoginMode) {
            const credentials: LoginCredentials = {
                email: formData.email,
                password: formData.password,
            };
            console.log("Logging in with credentials:", credentials);
            await login(credentials);
        } else {
            const credentials: RegisterCredentials = {
                email: formData.email,
                name: formData.name,
                password: formData.password,
            };
            await register(credentials);
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setFormData({ email: "", name: "", password: "" });
    };

    return (
        <LoginContainer>
            <LoginCard>
                <Logo>
                    <h1>Budger</h1>
                    <p>Personal Budget Management</p>
                </Logo>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Input
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />

                {!isLoginMode && (
                    <Input
                        type="text"
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                    />
                )}

                <Input
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />

                <ButtonContainer>
                    <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
                        {isLoading ? "Please wait..." : isLoginMode ? "Sign In" : "Create Account"}
                    </Button>
                </ButtonContainer>

                <ToggleMode>
                    <button type="button" onClick={toggleMode} disabled={isLoading}>
                        {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </ToggleMode>
            </LoginCard>
        </LoginContainer>
    );
}
