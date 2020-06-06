import React from "react";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import ScreenContainer from "../common/ScreenContainer";

const TransactionsContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: 15% 15% 15% 10% 10% 10% auto;
`;

const TransactionsHeaderText = styled.span`
    font-size: ${theme.font.size.big};
    font-weight: ${theme.font.weight.bold};
    padding: 16px;
    border-bottom: 2px solid ${theme.palette.background.contrast};
`;

const TransactionsRowText = styled.span`
    font-size: ${theme.font.size.small};
    padding: 16px;
    border-top: 1px solid ${theme.palette.divider.main};
`;

const TransactionsHeader = (): JSX.Element => {
    return (
        <>
            <TransactionsHeaderText>Payee</TransactionsHeaderText>
            <TransactionsHeaderText>Account</TransactionsHeaderText>
            <TransactionsHeaderText>Category</TransactionsHeaderText>
            <TransactionsHeaderText>Date</TransactionsHeaderText>
            <TransactionsHeaderText>In</TransactionsHeaderText>
            <TransactionsHeaderText>Out</TransactionsHeaderText>
            <TransactionsHeaderText>Notes</TransactionsHeaderText>
        </>
    );
};

const TransactionsRow = (): JSX.Element => {
    return (
        <>
            <TransactionsRowText>Test1</TransactionsRowText>
            <TransactionsRowText>Test1</TransactionsRowText>
            <TransactionsRowText>Test1</TransactionsRowText>
            <TransactionsRowText>Test1</TransactionsRowText>
            <TransactionsRowText>Test1</TransactionsRowText>
            <TransactionsRowText>Test1</TransactionsRowText>
            <TransactionsRowText>Test1</TransactionsRowText>
        </>
    );
};

const TransactionsScreen = (): JSX.Element => {
    return (
        <ScreenContainer>
            <TransactionsContainer>
                <TransactionsHeader />
                <TransactionsRow />
            </TransactionsContainer>
        </ScreenContainer>
    );
};

export default TransactionsScreen;
