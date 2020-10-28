import React from "react";
import styled from "styled-components";

import { theme, UNIT_LENGTH } from "../defs/theme";
import { ReactComponent as BudgerLogo } from "../resources/images/BudgerLogo.svg";
import t from "../services/i18n/language";
import Input from "./common/Input";

const AppBarContainer = styled.div`
    width: auto;
    min-height: ${UNIT_LENGTH}px;
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
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            console.log("no files");
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            const text = e && e.target && e.target.result;
            console.log(text);
            alert(text);
        };

        reader.readAsText(event.target.files[0]);
    };

    return (
        <AppBarContainer>
            <StyledBudgerIcon />
            {t("budger")}
            <Input type={"file"} onChange={handleFileChange} />
        </AppBarContainer>
    );
};

export default AppBar;
