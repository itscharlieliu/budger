import React from "react";
import t from "../../services/i18n/language";
import styled from "styled-components";
import { theme } from "../../defs/theme";
import ScreenContainer from "../common/ScreenContainer";
import { connect } from "react-redux";
import { AllAcounts, BankAccount } from "../../store/accounts/accountsInterfaces";
import ApplicationState from "../../store";

interface StateProps {
    allAccounts: AllAcounts;
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
    return (
        <>
            <AccountsRowText>{props.name}</AccountsRowText>
            <AccountsRowText>{props.type}</AccountsRowText>
            <AccountsRowText>{props.balance}</AccountsRowText>
        </>
    );
};

const AccountScreens = (props: StateProps): JSX.Element => {
    return (
        <ScreenContainer>
            <AccountsContainer>
                <AccountsHeader />
                {props.allAccounts.map((bankAccount: BankAccount, index: number) => (
                    <AccountsRow
                        key={"bankAccount" + index}
                        name={bankAccount.name}
                        type={bankAccount.type}
                        balance={bankAccount.balance}
                    />
                ))}
            </AccountsContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    allAccounts: state.accounts.allAcounts,
});

export default connect(mapStateToProps)(AccountScreens);
