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
import formatMoney from "../utils/formatMoney";

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
    // activity is in cents, so divide by 100 to get dollars for display
    const inFlow = props.activity > 0 ? props.activity / 100 : 0;
    const outFlow = props.activity < 0 ? -props.activity / 100 : 0;

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
                <span>{inFlow > 0 ? formatMoney(inFlow, 2) : ""}</span>
            </GridBoxContainer>
            <GridBoxContainer>
                <span>{outFlow > 0 ? formatMoney(outFlow, 2) : ""}</span>
            </GridBoxContainer>
            <GridBoxContainer>
                <span>{props.note}</span>
            </GridBoxContainer>
        </>
    );
};

const TransactionsScreen = (): JSX.Element => {
    const { transactions, deleteTransaction, isLoading } = useTransactions();

    const handleDelete = async (transactionId: string) => {
        await deleteTransaction(transactionId);
    };

    return (
        <SecureScreenContainer>
            <TransactionsContainer>
                <TransactionsHeader />
                {isLoading && <InfoCard>Loading transactions...</InfoCard>}
                {!isLoading && transactions.length === 0 && <InfoCard>No transactions to show.</InfoCard>}

                {transactions.map((transaction: Transaction) => (
                    <TransactionsRow
                        key={transaction.id || `transaction-${transaction.date.getTime()}`}
                        onDelete={() => transaction.id && handleDelete(transaction.id)}
                        {...transaction}
                    />
                ))}
            </TransactionsContainer>
        </SecureScreenContainer>
    );
};

export default TransactionsScreen;
