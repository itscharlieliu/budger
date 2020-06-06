import React from "react";
import styled from "styled-components";

import NavigationDrawer from "./components/NavigationDrawer";
import Router from "./components/Router";
import AppBar from "./components/common/AppBar";
import { BrowserRouter } from "react-router-dom";

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const BodyContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row;
`;

function App(): JSX.Element {
    return (
        <AppContainer>
            <BrowserRouter>
                <AppBar>Budger</AppBar>

                <BodyContainer>
                    <NavigationDrawer />
                    <Router />
                </BodyContainer>
            </BrowserRouter>
        </AppContainer>
    );
}

export default App;
