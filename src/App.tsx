import React from "react";
import styled from "styled-components";
import NavigationDrawer from "./components/NavigationDrawer";
import Router from "./components/Router";
import AppBar from "./components/common/AppBar";

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
`;

function App() {
    return (
        <AppContainer>
            <AppBar>Budger</AppBar>
            <NavigationDrawer />
            <Router />
        </AppContainer>
    );
}

export default App;
