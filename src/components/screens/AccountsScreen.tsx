import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import { ReactComponent as PlusIcon } from "../../resources/images/plusIcon.svg";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { AccountType, AllAccounts, BankAccount } from "../../store/accounts/accountsInterfaces";
import Button from "../common/Button";
import Modal from "../common/Modal";
import GridHeaderContainer from "../common/containers/GridHeaderContainer";
import ScreenContainer from "../common/containers/ScreenContainer";
import AccountAddForm from "../forms/AccountAddForm";
import { Transaction } from "../../store/transactions/transactionInterfaces";

interface StateProps {
    allAccounts: AllAccounts;
    transactions: Transaction[];
}

interface AccountsRowProps extends BankAccount {
    balance: string;
}

const AccountsContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 15% 15%;
`;

const AccountAddButton = styled(Button)`
    margin: -16px 16px;
`;

const AccountsRowText = styled.span`
    font-size: ${theme.font.size.small};
    padding: 16px;
    border-top: 1px solid ${theme.palette.divider.main};
`;

const AccountsHeader = (): JSX.Element => {
    const [isAddingAccount, setIsAddingAccount] = useState(false);
    return (
        <>
            <Modal visible={isAddingAccount} onClose={() => setIsAddingAccount(false)}>
                <AccountAddForm onSubmit={() => setIsAddingAccount(false)} />
            </Modal>
            <GridHeaderContainer>
                {t("accountName")}
                <AccountAddButton icon={<PlusIcon />} flat onClick={() => setIsAddingAccount(true)} />
            </GridHeaderContainer>
            <GridHeaderContainer>{t("type")}</GridHeaderContainer>
            <GridHeaderContainer>{t("balance")}</GridHeaderContainer>
        </>
    );
};

const AccountsRow = (props: AccountsRowProps): JSX.Element => {
    let accountType = "";

    switch (props.type) {
        case AccountType.budgeted:
            accountType = t("budgeted");
            break;
        case AccountType.unbudgeted:
            accountType = t("unbudgeted");
            break;
        default:
            accountType = t("unknown");
    }

    return (
        <>
            <AccountsRowText>{props.name}</AccountsRowText>
            <AccountsRowText>{accountType}</AccountsRowText>
            <AccountsRowText>{props.balance}</AccountsRowText>
        </>
    );
};

const AccountScreens = (props: StateProps): JSX.Element => {
    return (
        <ScreenContainer>
            <AccountsContainer>
                <AccountsHeader />
                {props.allAccounts.map((bankAccount: BankAccount, index: number) => {
                    // TODO THIS ABSOLUTELY NEEDS TO BE OPTIMIZED. It's currently O(n^2).
                    return (
                        <AccountsRow
                            key={"bankAccount" + index}
                            name={bankAccount.name}
                            type={bankAccount.type}
                            balance={props.transactions.reduce((totalBalance: number, transaction: Transaction) => {
                                if (transaction.account !== bankAccount.name){
                                    return totalBalance
                                }
                                return totalBalance + transaction.activity;
                            }, 0).toString()}
                        />
                    );
                })}
            </AccountsContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    allAccounts: state.accounts.allAccounts,
    transactions: state.transaction.transactions,
});

export default connect(mapStateToProps)(AccountScreens);
