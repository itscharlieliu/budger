import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import { ReactComponent as PlusIcon } from "../../resources/images/plusIcon.svg";
import { ReactComponent as Trash } from "../../resources/images/trash.svg";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { deleteAccount } from "../../store/accounts/accountsActions";
import { AccountType, AllAccounts, BankAccount } from "../../store/accounts/accountsInterfaces";
import { Transaction } from "../../store/transactions/transactionInterfaces";
import formatMoney from "../../utils/formatMoney";
import Button from "../common/Button";
import Modal from "../common/Modal";
import GridBoxContainer from "../common/containers/GridBoxContainer";
import GridHeaderContainer from "../common/containers/GridHeaderContainer";
import ScreenContainer from "../common/containers/ScreenContainer";
import AccountAddForm from "../forms/AccountAddForm";

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
            <GridBoxContainer>
                {props.name}
                <AccountRowButton icon={<Trash />} onClick={() => props.onDelete()} flat />
            </GridBoxContainer>
            <GridBoxContainer>{accountType}</GridBoxContainer>
            <GridBoxContainer>{formatMoney(props.cachedBalance, 2)}</GridBoxContainer>
        </>
    );
};

const AccountScreens = (props: AllProps): JSX.Element => {
    return (
        <ScreenContainer>
            <AccountsContainer>
                <AccountsHeader />
                {props.allAccounts.length === 0 && <InfoCard>{t("noAccounts")}</InfoCard>}
                {props.allAccounts.map((bankAccount: BankAccount, index: number) => {
                    return (
                        <AccountsRow
                            key={"bankAccount" + index}
                            name={bankAccount.name}
                            type={bankAccount.type}
                            onDelete={() => props.deleteAccount(bankAccount.name)}
                            cachedBalance={bankAccount.cachedBalance}
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
