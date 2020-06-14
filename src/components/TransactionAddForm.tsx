import styled from "styled-components";
import React from "react";
import Input from "./common/Input";

const TransactionAddContainer = styled.div`
    padding: 16px;
`;

const TransactionAddForm = (): JSX.Element => {
    return (
        <TransactionAddContainer>
            <Input placeholder={"hello"} />
        </TransactionAddContainer>
    );
};

export default TransactionAddForm;
