import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { Transaction } from "../../store/transactions/transactionInterfaces";
import GridHeaderContainer from "../common/containers/GridHeaderContainer";
import ScreenContainer from "../common/containers/ScreenContainer";

interface StateProps {
    transactions: Transaction[];
}

const TransactionsContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 10% 10% 10% 10% 10% 15%;
`;

const TransactionsRowText = styled.span`
    font-size: ${theme.font.size.small};
    padding: 16px;
    border-top: 1px solid ${theme.palette.divider.main};
`;

const TransactionsHeader = (): JSX.Element => {
    return (
        <>
            <GridHeaderContainer>{t("toFrom")}</GridHeaderContainer>
            <GridHeaderContainer>{t("account")}</GridHeaderContainer>
            <GridHeaderContainer>{t("category")}</GridHeaderContainer>
            <GridHeaderContainer>{t("date")}</GridHeaderContainer>
            <GridHeaderContainer>{t("in")}</GridHeaderContainer>
            <GridHeaderContainer>{t("out")}</GridHeaderContainer>
            <GridHeaderContainer>{t("notes")}</GridHeaderContainer>
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
            <TransactionsRowText>{t("fullDate", { date: props.date })}</TransactionsRowText>
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
