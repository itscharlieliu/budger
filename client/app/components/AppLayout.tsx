import React from "react";
import styled from "styled-components";

import AppBar from "./AppBar";
import NavigationDrawer from "./NavigationDrawer";
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
    const { restoreUserSession } = useAuth();

    useMount(() => {
        // Initialize authentication first
        restoreUserSession();
    });

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
