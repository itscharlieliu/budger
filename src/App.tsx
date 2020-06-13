import React, { useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";

import AppBar from "./components/AppBar";
import NavigationDrawer from "./components/NavigationDrawer";
import Router from "./components/Router";
import { I18N_DEFAULT_OPTIONS } from "./defs/i18n";
import { language } from "./services/i18n/language";
import ApplicationState from "./store";
import { setLanguageInitialized } from "./store/initialization/initializationActions";
import useMount from "./utils/useMount";

interface StateProps {
    translationInitialized: boolean;
}

interface DispatchProps {
    setLanguageInitialized: typeof setLanguageInitialized;
}

type AllProps = StateProps & DispatchProps;

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

function App(props: AllProps): JSX.Element {
    useMount(() => {
        // initialize everything on app mount
        language
            .init(I18N_DEFAULT_OPTIONS)
            .then(() => props.setLanguageInitialized(true))
            .catch((e: Error) => console.error(e));
    });

    if (!props.translationInitialized) {
        return <div>No init</div>;
    }

    return (
        <AppContainer>
            <BrowserRouter>
                <AppBar />

                <BodyContainer>
                    <NavigationDrawer />
                    <Router />
                </BodyContainer>
            </BrowserRouter>
        </AppContainer>
    );
}

const mapStateToProps = (state: ApplicationState): StateProps => ({
    translationInitialized: state.initialization.translationInitialized,
});

const mapDispatchToProps: DispatchProps = {
    setLanguageInitialized,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
