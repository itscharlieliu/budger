import React from "react";
import t from "../../services/i18n/language";
import styled from "styled-components";
import { theme } from "../../defs/theme";
import ScreenContainer from "../common/ScreenContainer";

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

const AccountsRow = (): JSX.Element => {
    return (
        <>
            <AccountsRowText>test</AccountsRowText>
            <AccountsRowText>test1</AccountsRowText>
            <AccountsRowText>test2</AccountsRowText>
        </>
    );
};

const AccountScreens = (): JSX.Element => {
    return (
        <ScreenContainer>
            <AccountsContainer>
                <AccountsHeader />
                <AccountsRow />
            </AccountsContainer>
        </ScreenContainer>
    );
};

export default AccountScreens;
