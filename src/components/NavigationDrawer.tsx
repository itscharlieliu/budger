import React from "react";
import { useLocation, useHistory } from "react-router-dom";

import { BUDGET, TRANSACTIONS } from "../defs/routerPaths";
import t from "../services/i18n/language";

import Drawer from "./common/Drawer";
import DrawerListItem from "./common/DrawerListItem";
import Icon from "./common/Icon";
import Button from "./common/Button";
import { ReactComponent as PlusIcon } from "../resources/images/plusIcon.svg";
import { ReactComponent as WalletIcon } from "../resources/images/wallet.svg";
import { ReactComponent as RecieptIcon } from "../resources/images/reciept.svg";

const NavigationDrawer = (): JSX.Element => {
    const location = useLocation();
    const history = useHistory();

    return (
        <Drawer>
            <Button icon={<PlusIcon />}>{t("addTransaction")}</Button>
            <DrawerListItem isHighlighted={location.pathname === BUDGET} isButton onClick={() => history.push(BUDGET)}>
                <Icon edge={"left"}>
                    <WalletIcon />
                </Icon>
                {t("budget")}
            </DrawerListItem>
            <DrawerListItem
                isHighlighted={location.pathname === TRANSACTIONS}
                isButton
                onClick={() => history.push(TRANSACTIONS)}
            >
                <Icon edge={"left"}>
                    <RecieptIcon />
                </Icon>
                {t("transactions")}
            </DrawerListItem>
        </Drawer>
    );
};

export default NavigationDrawer;
