"use client";

import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import AppBar from "./AppBar";
import NavigationDrawer from "./NavigationDrawer";
import { I18N_DEFAULT_OPTIONS } from "../defs/i18n";
import { language } from "../services/i18n/language";
import ApplicationState from "../store";
import {
    initAccounts,
    initBudget,
    initTransactions,
    setLanguageInitialized,
} from "../store/initialization/initializationActions";
import useMount from "../utils/useMount";

interface StateProps {
    translationInitialized: boolean;
}

interface DispatchProps {
    setLanguageInitialized: typeof setLanguageInitialized;
    initBudget: typeof initBudget;
    initTransactions: typeof initTransactions;
    initAccounts: typeof initAccounts;
}

type AllProps = StateProps & ResolveThunks<DispatchProps>;

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

function AppLayout({ children, ...props }: AllProps & { children: React.ReactNode }): JSX.Element {
    useMount(() => {
        // initialize everything on app mount
        language
            .init(I18N_DEFAULT_OPTIONS)
            .then(() => props.setLanguageInitialized(true))
            .catch((e: Error) => console.error(e));
        props.initBudget();
        props.initTransactions();
        props.initAccounts();
    });

    if (!props.translationInitialized) {
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

const mapStateToProps = (state: ApplicationState): StateProps => ({
    translationInitialized: state.initialization.translationInitialized,
});

const mapDispatchToProps: DispatchProps = {
    setLanguageInitialized,
    initBudget,
    initTransactions,
    initAccounts,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);
