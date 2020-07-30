import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { Transaction } from "../../store/transactions/transactionInterfaces";
import GridHeaderContainer from "../common/containers/GridHeaderContainer";
import ScreenContainer from "../common/containers/ScreenContainer";
import { deleteTransaction } from "../../store/transactions/transactionActions";
import { ReactComponent as Trash } from "../../resources/images/trash.svg";
import Button from "../common/Button";

interface StateProps {
    transactions: Transaction[];
}

interface DispatchProps {
    deleteTransaction: typeof deleteTransaction;
}

type AllProps = StateProps & ResolveThunks<DispatchProps>;

interface TransactionsRowProps extends Transaction {
    onDelete: () => void;
}

const TransactionsContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 10% 10% 10% 10% 10% 15%;
`;

const TransactionContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: ${theme.font.size.small};
    padding: 16px;
    border-top: 1px solid ${theme.palette.divider.main};
`;

const TransactionRowButton = styled(Button)`
    margin: -16px 0 -16px 16px;
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

const TransactionsRow = (props: TransactionsRowProps): JSX.Element => {
    const inFlow = props.activity > 0 ? props.activity : 0;
    const outFlow = props.activity < 0 ? -props.activity : 0;

    return (
        <>
            <TransactionContainer>
                {props.payee}
                <TransactionRowButton icon={<Trash />} onClick={() => props.onDelete()} flat />
            </TransactionContainer>
            <TransactionContainer>{props.account}</TransactionContainer>
            <TransactionContainer>{props.category}</TransactionContainer>
            <TransactionContainer>{t("fullDate", { date: props.date })}</TransactionContainer>
            <TransactionContainer>{inFlow}</TransactionContainer>
            <TransactionContainer>{outFlow}</TransactionContainer>
            <TransactionContainer>{props.note}</TransactionContainer>
        </>
    );
};

const TransactionsScreen = (props: AllProps): JSX.Element => {
    return (
        <ScreenContainer>
            <TransactionsContainer>
                <TransactionsHeader />
                {props.transactions.map((transaction: Transaction, index: number) => (
                    <TransactionsRow
                        key={"transaction" + index}
                        onDelete={() => props.deleteTransaction(index)}
                        {...transaction}
                    />
                ))}
            </TransactionsContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    transactions: state.transaction.transactions,
});

const mapDispatchToProps: DispatchProps = {
    deleteTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsScreen);
