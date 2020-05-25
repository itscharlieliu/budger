import React from "react";
import Header from "./common/components/Header";
import styled from "styled-components";
import NavigationDrawer from "./common/components/NavigationDrawer";

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
`;

function App() {
    return (
        <AppContainer>
            <Header />
            <NavigationDrawer />
        </AppContainer>
    );
}

export default App;
