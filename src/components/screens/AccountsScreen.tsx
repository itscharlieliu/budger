import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { AccountType, AllAccounts, BankAccount } from "../../store/accounts/accountsInterfaces";
import ScreenContainer from "../common/ScreenContainer";

interface StateProps {
    allAccounts: AllAccounts;
}

const AccountsContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 15% 15%;
`;

const AccountsHeaderText = styled.span`
    font-size: ${theme.font.size.big};
    font-weight: ${theme.font.weight.bold};
    padding: 16px;
    border-bottom: 2px solid ${theme.palette.background.contrast};
`;

const AccountsRowText = styled.span`
    font-size: ${theme.font.size.small};
    padding: 16px;
    border-top: 1px solid ${theme.palette.divider.main};
`;

const AccountsHeader = (): JSX.Element => {
    return (
        <>
            <AccountsHeaderText>{t("accountName")}</AccountsHeaderText>
            <AccountsHeaderText>{t("type")}</AccountsHeaderText>
            <AccountsHeaderText>{t("balance")}</AccountsHeaderText>
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
