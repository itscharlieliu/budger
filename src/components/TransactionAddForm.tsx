import styled from "styled-components";
import React from "react";
import Input from "./common/Input";
import t from "../services/i18n/language";
import Button from "./common/Button";

const TransactionAddContainer = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const TransactionAddForm = (): JSX.Element => {
    return (
        <TransactionAddContainer>
            <Input placeholder={t("toFrom")} />
            <Input placeholder={t("account")} />
            <Input placeholder={t("category")} />
            <Input placeholder={t("date")} />
            <Input placeholder={t("in")} />
            <Input placeholder={t("out")} />
            <Input placeholder={t("notes")} />
            <Button>add</Button>
            <Button>cancel</Button>
        </TransactionAddContainer>
    );
};

export default TransactionAddForm;
