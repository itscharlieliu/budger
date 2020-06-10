import React from "react";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import ScreenContainer from "../common/ScreenContainer";
import { Transaction } from "../../store/transactions/transactionInterfaces";
import { connect } from "react-redux";
import ApplicationState from "../../store";

interface StateProps {
    transactions: Transaction[];
}

const TransactionsContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: 15% 10% 10% 10% 10% 10% auto;
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
            <TransactionsHeaderText>To / From</TransactionsHeaderText>
            <TransactionsHeaderText>Account</TransactionsHeaderText>
            <TransactionsHeaderText>Category</TransactionsHeaderText>
            <TransactionsHeaderText>Date</TransactionsHeaderText>
            <TransactionsHeaderText>In</TransactionsHeaderText>
            <TransactionsHeaderText>Out</TransactionsHeaderText>
            <TransactionsHeaderText>Notes</TransactionsHeaderText>
        </>
    );
};

const TransactionsRow = (props: Transaction): JSX.Element => {
    const inFlow = props.activity > 0 ? props.activity : 0;
    const outFlow = props.activity < 0 ? -props.activity : 0;

    return (
        <>
            <TransactionsRowText>{props.payee}</TransactionsRowText>
            <TransactionsRowText>{props.account}</TransactionsRowText>
            <TransactionsRowText>{props.category}</TransactionsRowText>
            <TransactionsRowText>{props.date.getTime()}</TransactionsRowText>
            <TransactionsRowText>{inFlow}</TransactionsRowText>
            <TransactionsRowText>{outFlow}</TransactionsRowText>
            <TransactionsRowText>{props.note}</TransactionsRowText>
        </>
    );
};

const TransactionsScreen = (props: StateProps): JSX.Element => {
    return (
        <ScreenContainer>
            <TransactionsContainer>
                <TransactionsHeader />
                {props.transactions.map((transaction: Transaction, index: number) => (
                    <TransactionsRow key={"transaction" + index} {...transaction} />
                ))}
            </TransactionsContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    transactions: state.transaction.transactions,
});

export default connect(mapStateToProps, {})(TransactionsScreen);
