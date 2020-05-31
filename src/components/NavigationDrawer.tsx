import React from "react";
import { FiCreditCard, FiDatabase } from "react-icons/all";

import Divider from "./common/Divider";
import Drawer from "./common/Drawer";
import Icon from "./common/Icon";
import ListItem from "./common/ListItem";

const NavigationDrawer = (): JSX.Element => {
    return (
        <Drawer>
            <ListItem>
                <Icon edge={"left"}>
                    <FiCreditCard />
                </Icon>
                Budget
            </ListItem>
            <ListItem>
                <Icon edge={"left"}>
                    <FiDatabase />
                </Icon>
                Accounts
            </ListItem>
        </Drawer>
    );
};

export default NavigationDrawer;
