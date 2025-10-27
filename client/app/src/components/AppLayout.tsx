"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

import AppBar from "./AppBar";
import NavigationDrawer from "./NavigationDrawer";
import { I18N_DEFAULT_OPTIONS } from "../defs/i18n";
import { language } from "../services/i18n/language";
import { useAuth } from "../contexts/AuthContext";
import useMount from "../utils/useMount";

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const BodyContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
`;

const ContentArea = styled.div`
    flex-grow: 1;
    overflow: auto;
`;

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps): JSX.Element {
    const [translationInitialized, setTranslationInitialized] = useState(false);
    const { restoreUserSession } = useAuth();

    useMount(() => {
        // Initialize authentication first
        restoreUserSession();

        // initialize everything on app mount
        language
            .init(I18N_DEFAULT_OPTIONS)
            .then(() => setTranslationInitialized(true))
            .catch((e: Error) => console.error(e));
    });

    if (!translationInitialized) {
        return <div>No init</div>;
    }

    return (
        <AppContainer>
            <AppBar />
            <BodyContainer>
                <NavigationDrawer />
                <ContentArea>{children}</ContentArea>
            </BodyContainer>
        </AppContainer>
    );
}
