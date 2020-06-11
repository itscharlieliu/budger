import React from "react";
import { FiCreditCard, FiDatabase } from "react-icons/all";
import { useLocation, useHistory } from "react-router-dom";

import { BUDGET, TRANSACTIONS } from "../defs/routerPaths";
import t from "../services/language";

import Drawer from "./common/Drawer";
import DrawerListItem from "./common/DrawerListItem";
import Icon from "./common/Icon";

const NavigationDrawer = (): JSX.Element => {
    const location = useLocation();
    const history = useHistory();

    return (
        <Drawer>
            <DrawerListItem isHighlighted={location.pathname === BUDGET} isButton onClick={() => history.push(BUDGET)}>
                <Icon edge={"left"}>
                    <FiCreditCard />
                </Icon>
                {t("budget")}
            </DrawerListItem>
            <DrawerListItem
                isHighlighted={location.pathname === TRANSACTIONS}
                isButton
                onClick={() => history.push(TRANSACTIONS)}
            >
                <Icon edge={"left"}>
                    <FiDatabase />
                </Icon>
                {t("transactions")}
            </DrawerListItem>
        </Drawer>
    );
};

export default NavigationDrawer;
