import React from "react";
import { FiCreditCard, FiDatabase } from "react-icons/all";
import { useLocation, useHistory } from "react-router-dom";

import { BUDGET, TRANSACTIONS } from "../defs/routerPaths";

import Drawer from "./common/Drawer";
import Icon from "./common/Icon";
import DrawerListItem from "./common/DrawerListItem";

const NavigationDrawer = (): JSX.Element => {
    const location = useLocation();
    const history = useHistory();

    console.log("rerendered");

    return (
        <Drawer>
            <DrawerListItem isHighlighted={location.pathname === BUDGET} isButton onClick={() => history.push(BUDGET)}>
                <Icon edge={"left"}>
                    <FiCreditCard />
                </Icon>
                Budget
            </DrawerListItem>
            <DrawerListItem
                isHighlighted={location.pathname === TRANSACTIONS}
                isButton
                onClick={() => history.push(TRANSACTIONS)}
            >
                <Icon edge={"left"}>
                    <FiDatabase />
                </Icon>
                Accounts
            </DrawerListItem>
        </Drawer>
    );
};

export default NavigationDrawer;
