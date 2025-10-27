import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme, UNIT_LENGTH } from "../defs/theme";
import BudgerLogo from "../resources/images/BudgerLogo.svg";
import t from "../services/i18n/language";
import ApplicationState from "../store";
import { logoutUser } from "../store/auth/authActions";
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

interface StateProps {
    user: any;
}

interface DispatchProps {
    logoutUser: typeof logoutUser;
}

type AllProps = StateProps & ResolveThunks<DispatchProps>;

const AppBar = ({ user, logoutUser }: AllProps): JSX.Element => {
    const handleLogout = () => {
        logoutUser();
    };

    return (
        <AppBarContainer>
            <LeftSection>
                <StyledBudgerIcon />
                {t("budger")}
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

const mapStateToProps = (state: ApplicationState): StateProps => ({
    user: state.auth.user,
});

const mapDispatchToProps: DispatchProps = {
    logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);
