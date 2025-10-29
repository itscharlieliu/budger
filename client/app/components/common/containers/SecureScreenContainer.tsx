import React from "react";
import styled from "styled-components";

import { UNIT_LENGTH } from "../../../defs/theme";
import ProtectedRoute from "../../ProtectedRoute";
import AppLayout from "../../AppLayout";

const ScreenContainerStyled = styled.div`
    flex-grow: 1;
    padding: ${UNIT_LENGTH / 2}px;
    overflow: auto;
`;

interface SecureScreenContainerProps {
    children: React.ReactNode;
}

const SecureScreenContainer = ({ children }: SecureScreenContainerProps): JSX.Element => {
    return (
        <ProtectedRoute>
            <AppLayout>
                <ScreenContainerStyled>{children}</ScreenContainerStyled>
            </AppLayout>
        </ProtectedRoute>
    );
};

export default SecureScreenContainer;
