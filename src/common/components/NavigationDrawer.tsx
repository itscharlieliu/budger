import React from "react";
import { Divider, Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import styled from "styled-components";

export const DRAWER_WIDTH_PX = 300;

const DrawerList = styled(List)`
    width: ${DRAWER_WIDTH_PX}px;
`;

const NavigationDrawer = (): JSX.Element => {
    return (
        <Drawer variant="permanent">
            <DrawerList>
                <ListItem>
                    <ListItemText primary="Budger" />
                </ListItem>
            </DrawerList>
            <Divider />
            <DrawerList>
                <ListItem>
                    <ListItemText primary="Budget" />
                </ListItem>
            </DrawerList>
        </Drawer>
    );
};

export default NavigationDrawer;
