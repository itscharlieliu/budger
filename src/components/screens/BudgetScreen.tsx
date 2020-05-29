import React from "react";
import styled from "styled-components";
import { UNIT_LENGTH } from "../../defs/theme";
import Header from "../common/Header";

const ScreenContainer = styled.div`
    padding: ${UNIT_LENGTH}px;
`;

const BudgetScreen = (): JSX.Element => {
    return (
        <ScreenContainer>
            <Header>Budget</Header>
        </ScreenContainer>
    );
};

export default BudgetScreen;
