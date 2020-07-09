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

interface StateProps {
    allAccounts: AllAccounts;
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

const AccountsRow = (props: BankAccount): JSX.Element => {
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
                    return (
                        <AccountsRow
                            key={"bankAccount" + index}
                            name={bankAccount.name}
                            type={bankAccount.type}
                            balance={bankAccount.balance}
                        />
                    );
                })}
            </AccountsContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    allAccounts: state.accounts.allAccounts,
});

export default connect(mapStateToProps)(AccountScreens);
