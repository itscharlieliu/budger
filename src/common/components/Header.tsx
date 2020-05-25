import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Header = (): JSX.Element => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography>Test</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
