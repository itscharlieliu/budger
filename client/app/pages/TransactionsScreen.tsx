import React, { useState } from "react";
import styled from "styled-components";

import { theme } from "../defs/theme";
import PlusIcon from "../resources/images/plusIcon.svg";
import Trash from "../resources/images/trash.svg";
import { Transaction } from "../store/transactions/transactionInterfaces";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import GridBoxContainer from "../components/common/containers/GridBoxContainer";
import GridHeaderContainer from "../components/common/containers/GridHeaderContainer";
import SecureScreenContainer from "../components/common/containers/SecureScreenContainer";
import TransactionAddForm from "../components/forms/TransactionAddForm";
import { useTransactions } from "../hooks/useTransactions";

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
                <span>To / From</span>
                <TransactionRowButton icon={<PlusIcon />} flat onClick={() => setIsAddingTransaction(true)} />
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>Account</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>Category</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>Date</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>In</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>Out</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>Notes</span>
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
                <span>{props.date.toLocaleDateString()}</span>
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

const TransactionsScreen = (): JSX.Element => {
    const { transactions, deleteTransaction } = useTransactions();

    return (
        <SecureScreenContainer>
            <TransactionsContainer>
                <TransactionsHeader />
                {transactions.length === 0 && <InfoCard>No transactions to show.</InfoCard>}

                {transactions.map((transaction: Transaction, index: number) => (
                    <TransactionsRow
                        key={"transaction" + index}
                        onDelete={() => deleteTransaction(index.toString())}
                        {...transaction}
                    />
                ))}
            </TransactionsContainer>
        </SecureScreenContainer>
    );
};

export default TransactionsScreen;
