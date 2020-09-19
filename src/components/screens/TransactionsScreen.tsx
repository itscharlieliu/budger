import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import { ReactComponent as PlusIcon } from "../../resources/images/plusIcon.svg";
import { ReactComponent as Trash } from "../../resources/images/trash.svg";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { deleteTransaction } from "../../store/transactions/transactionActions";
import { Transaction } from "../../store/transactions/transactionInterfaces";
import Button from "../common/Button";
import Modal from "../common/Modal";
import GridBoxContainer from "../common/containers/GridBoxContainer";
import GridHeaderContainer from "../common/containers/GridHeaderContainer";
import ScreenContainer from "../common/containers/ScreenContainer";
import TransactionAddForm from "../forms/TransactionAddForm";

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

const TransactionRowButton = styled(Button)`
    margin: -16px 0 -16px 16px;
`;

const InfoCard = styled.div`
    border-radius: 4px;
    ${theme.shadow.low};
    margin: 16px;
    padding: 16px;

    grid-column-start: 1;
    grid-column-end: 8;
`;

const TransactionsHeader = (): JSX.Element => {
    const [isAddingTransaction, setIsAddingTransaction] = useState(false);

    return (
        <>
            <GridHeaderContainer>
                <Modal
                    visible={isAddingTransaction}
                    onClose={() => {
                        setIsAddingTransaction(false);
                    }}
                >
                    <TransactionAddForm onSubmit={() => setIsAddingTransaction(false)} />
                </Modal>
                <span>{t("toFrom")}</span>
                <TransactionRowButton icon={<PlusIcon />} flat onClick={() => setIsAddingTransaction(true)} />
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>{t("account")}</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>{t("category")}</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>{t("date")}</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>{t("in")}</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>{t("out")}</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>{t("notes")}</span>
            </GridHeaderContainer>
        </>
    );
};

const TransactionsRow = (props: TransactionsRowProps): JSX.Element => {
    const inFlow = props.activity > 0 ? props.activity : 0;
    const outFlow = props.activity < 0 ? -props.activity : 0;

    return (
        <>
            <GridBoxContainer>
                <span>{props.payee}</span>
                <TransactionRowButton icon={<Trash />} onClick={() => props.onDelete()} flat />
            </GridBoxContainer>
            <GridBoxContainer>
                <span>{props.account}</span>
            </GridBoxContainer>
            <GridBoxContainer>
                <span>{props.category}</span>
            </GridBoxContainer>
            <GridBoxContainer>
                <span>{t("fullDate", { date: props.date })}</span>
            </GridBoxContainer>
            <GridBoxContainer>
                <span>{inFlow}</span>
            </GridBoxContainer>
            <GridBoxContainer>
                <span>{outFlow}</span>
            </GridBoxContainer>
            <GridBoxContainer>
                <span>{props.note}</span>
            </GridBoxContainer>
        </>
    );
};

const TransactionsScreen = (props: AllProps): JSX.Element => {
    return (
        <ScreenContainer>
            <TransactionsContainer>
                <TransactionsHeader />
                {props.transactions.length === 0 && <InfoCard>{t("noTransactions")}</InfoCard>}

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
