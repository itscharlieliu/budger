import React from "react";
import styled from "styled-components";

import { theme, UNIT_LENGTH } from "../defs/theme";
import { ReactComponent as BudgerLogo } from "../resources/images/BudgerLogo.svg";

const AppBarContainer = styled.div`
    width: auto;
    height: ${UNIT_LENGTH}px;
    display: flex;
    flex-direction: row;
    padding: 0 ${UNIT_LENGTH / 4}px;
    align-items: center;
    border-bottom: 1px solid ${theme.palette.divider.main};
`;

const StyledBudgerIcon = styled(BudgerLogo)`
    width: ${UNIT_LENGTH / 2}px;
    height: ${UNIT_LENGTH / 2}px;
    margin-right: 16px;
`;

const AppBar = (): JSX.Element => {
    return (
        <AppBarContainer>
            <StyledBudgerIcon />
            Budger
        </AppBarContainer>
    );
};

export default AppBar;
