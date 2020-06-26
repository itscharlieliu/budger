import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { BUDGET, TRANSACTIONS } from "../defs/routerPaths";
import { ReactComponent as PlusIcon } from "../resources/images/plusIcon.svg";
import { ReactComponent as RecieptIcon } from "../resources/images/reciept.svg";
import { ReactComponent as WalletIcon } from "../resources/images/wallet.svg";
import t from "../services/i18n/language";

import TransactionAddForm from "./TransactionAddForm";
import Button from "./common/Button";
import Drawer from "./common/Drawer";
import DrawerListItem from "./common/DrawerListItem";
import Icon from "./common/Icon";
import Modal from "./common/Modal";
import styled from "styled-components";

const DrawerButton = styled(Button)`
    margin: 16px;
`;

const NavigationDrawer = (): JSX.Element => {
    const [isAddingTransaction, setIsAddingTransaction] = useState(false);
    const location = useLocation();
    const history = useHistory();

    return (
        <Drawer>
            <Modal
                visible={isAddingTransaction}
                onClose={() => {
                    setIsAddingTransaction(false);
                }}
            >
                <TransactionAddForm />
            </Modal>

            <DrawerButton onClick={() => setIsAddingTransaction(true)} icon={<PlusIcon />}>
                {t("addTransaction")}
            </DrawerButton>
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
