import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import styled from "styled-components";
import { DRAWER_WIDTH_PX } from "./NavigationDrawer";

const HeaderBar = styled(AppBar)`
  && {
    width: calc(100% - ${DRAWER_WIDTH_PX}px);
    //margin-left: ${DRAWER_WIDTH_PX}px;
  }
`;

const Header = (): JSX.Element => {
    return (
        <HeaderBar position="fixed">
            <Toolbar>
                <Typography variant="h6">Budger</Typography>
            </Toolbar>
        </HeaderBar>
    );
};

export default Header;
