import React from "react";
import { FiCreditCard, FiDatabase } from "react-icons/all";
import { useLocation, useHistory } from "react-router-dom";

import { BUDGET, TRANSACTIONS } from "../defs/routerPaths";

import Drawer from "./common/Drawer";
import Icon from "./common/Icon";
import ListItem from "./common/ListItem";

const NavigationDrawer = (): JSX.Element => {
    const location = useLocation();
    const history = useHistory();

    return (
        <Drawer>
            <ListItem isHighlighted={location.pathname === BUDGET} isButton onClick={() => history.push(BUDGET)}>
                <Icon edge={"left"}>
                    <FiCreditCard />
                </Icon>
                Budget
            </ListItem>
            <ListItem
                isHighlighted={location.pathname === TRANSACTIONS}
                isButton
                onClick={() => history.push(TRANSACTIONS)}
            >
                <Icon edge={"left"}>
                    <FiDatabase />
                </Icon>
                Accounts
            </ListItem>
        </Drawer>
    );
};

export default NavigationDrawer;
