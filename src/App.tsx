import React from "react";
import styled from "styled-components";
import NavigationDrawer from "./components/NavigationDrawer";
import Router from "./components/Router";
import AppBar from "./components/common/AppBar";

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
`;

const BodyContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;

function App() {
    return (
        <AppContainer>
            <NavigationDrawer />
            <BodyContainer>
                <AppBar>Budger</AppBar>
                <Router />
            </BodyContainer>
        </AppContainer>
    );
}

export default App;
