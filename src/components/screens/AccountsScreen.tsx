import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
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
import { deleteAccount } from "../../store/accounts/accountsActions";
import { deleteTransaction } from "../../store/transactions/transactionActions";
import { ReactComponent as Trash } from "../../resources/images/trash.svg";

interface StateProps {
    allAccounts: AllAccounts;
    transactions: Transaction[];
}

interface DispatchProps {
    deleteAccount: typeof deleteAccount;
}

type AllProps = StateProps & ResolveThunks<DispatchProps>;

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

const AccountContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: ${theme.font.size.small};
    padding: 16px;
    border-top: 1px solid ${theme.palette.divider.main};
`;

const AccountRowButton = styled(Button)`
    margin: -16px 0 -16px 16px;
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
            <AccountContainer>
                {props.name}
                <AccountRowButton icon={<Trash />} onClick={() => props.onDelete()} flat />
            </AccountContainer>
            <AccountContainer>{accountType}</AccountContainer>
            <AccountContainer>{props.cachedBalance}</AccountContainer>
        </>
    );
};

const AccountScreens = (props: AllProps): JSX.Element => {
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
                            onDelete={() => props.deleteAccount(bankAccount.name)}
                            cachedBalance={props.transactions.reduce(
                                (totalBalance: number, transaction: Transaction) => {
                                    if (transaction.account !== bankAccount.name) {
                                        return totalBalance;
                                    }
                                    return totalBalance + transaction.activity;
                                },
                                0,
                            )}
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

const mapDispatchToProps: DispatchProps = {
    deleteAccount,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreens);
