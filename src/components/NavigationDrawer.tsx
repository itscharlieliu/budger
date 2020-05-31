import React from "react";
import Drawer from "./common/Drawer";
import ListItem from "./common/ListItem";
import Divider from "./common/Divider";
import { FiCreditCard, FiDatabase } from "react-icons/all";
import Icon from "./common/Icon";

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
