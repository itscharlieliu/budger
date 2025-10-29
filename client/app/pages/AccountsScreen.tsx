import React, { useState } from "react";
import styled from "styled-components";

import { theme } from "../defs/theme";
import PlusIcon from "../resources/images/plusIcon.svg";
import Trash from "../resources/images/trash.svg";
import { AccountType, BankAccount } from "../store/accounts/accountsInterfaces";
import formatMoney from "../utils/formatMoney";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import GridBoxContainer from "../components/common/containers/GridBoxContainer";
import GridHeaderContainer from "../components/common/containers/GridHeaderContainer";
import SecureScreenContainer from "../components/common/containers/SecureScreenContainer";
import AccountAddForm from "../components/forms/AccountAddForm";
import { useAccounts } from "../hooks/useAccounts";

interface AccountsRowProps extends BankAccount {
    onDelete: () => void;
}

const AccountsContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 15% 15%;
`;

const AccountAddButton = styled(Button)`
    margin: -16px 16px;
`;

const AccountRowButton = styled(Button)`
    margin: -16px 0 -16px 16px;
`;

const InfoCard = styled.div`
    border-radius: 4px;
    ${theme.shadow.low};
    margin: 16px;
    padding: 16px;

    grid-column-start: 1;
    grid-column-end: 4;
`;

const AccountsHeader = (): JSX.Element => {
    const [isAddingAccount, setIsAddingAccount] = useState(false);
    return (
        <>
            <Modal visible={isAddingAccount} onClose={() => setIsAddingAccount(false)}>
                <AccountAddForm onSubmit={() => setIsAddingAccount(false)} />
            </Modal>
            <GridHeaderContainer>
                Account Name
                <AccountAddButton icon={<PlusIcon />} flat onClick={() => setIsAddingAccount(true)} />
            </GridHeaderContainer>
            <GridHeaderContainer>Type</GridHeaderContainer>
            <GridHeaderContainer>Balance</GridHeaderContainer>
        </>
    );
};

const AccountsRow = (props: AccountsRowProps): JSX.Element => {
    let accountType = "";

    switch (props.type) {
        case AccountType.budgeted:
            accountType = "Budgeted";
            break;
        case AccountType.unbudgeted:
            accountType = "Unbudgeted";
            break;
        default:
            accountType = "Unknown";
    }

    return (
        <>
            <GridBoxContainer>
                {props.name}
                <AccountRowButton icon={<Trash />} onClick={() => props.onDelete()} flat />
            </GridBoxContainer>
            <GridBoxContainer>{accountType}</GridBoxContainer>
            <GridBoxContainer>{formatMoney(props.cachedBalance, 2)}</GridBoxContainer>
        </>
    );
};

const AccountsScreen = (): JSX.Element => {
    const { allAccounts, deleteAccount } = useAccounts();

    return (
        <SecureScreenContainer>
            <AccountsContainer>
                <AccountsHeader />
                {allAccounts.length === 0 && <InfoCard>No accounts added.</InfoCard>}
                {allAccounts.map((bankAccount: BankAccount, index: number) => {
                    return (
                        <AccountsRow
                            key={"bankAccount" + index}
                            name={bankAccount.name}
                            type={bankAccount.type}
                            onDelete={() => deleteAccount(index)}
                            cachedBalance={bankAccount.cachedBalance}
                        />
                    );
                })}
            </AccountsContainer>
        </SecureScreenContainer>
    );
};

export default AccountsScreen;
