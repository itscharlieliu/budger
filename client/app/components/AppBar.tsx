import React from "react";
import styled from "styled-components";

import { theme, UNIT_LENGTH } from "../defs/theme";
import BudgerLogo from "../resources/images/BudgerLogo.svg";
import { useAuth } from "../contexts/AuthContext";
import Button from "./common/Button";

const AppBarContainer = styled.div`
    width: auto;
    min-height: ${UNIT_LENGTH}px;
    display: flex;
    flex-direction: row;
    padding: 0 ${UNIT_LENGTH / 4}px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${theme.palette.divider.main};
`;

const LeftSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const RightSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
`;

const StyledBudgerIcon = styled(BudgerLogo)`
    width: ${UNIT_LENGTH / 2}px;
    height: ${UNIT_LENGTH / 2}px;
    margin-right: 16px;
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .name {
        font-weight: ${theme.font.weight.bold};
        color: ${theme.palette.background.contrast};
    }

    .email {
        font-size: 0.8rem;
        color: ${theme.palette.background.contrast};
        opacity: 0.7;
    }
`;

const AppBar = (): JSX.Element => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <AppBarContainer>
            <LeftSection>
                <StyledBudgerIcon />
                Budger
            </LeftSection>

            <RightSection>
                {user && (
                    <UserInfo>
                        <div className="name">{user.name}</div>
                        <div className="email">{user.email}</div>
                    </UserInfo>
                )}
                <Button flat onClick={handleLogout}>
                    Logout
                </Button>
            </RightSection>
        </AppBarContainer>
    );
};

export default AppBar;
