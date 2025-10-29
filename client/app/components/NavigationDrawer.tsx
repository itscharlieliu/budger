import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ACCOUNTS, TRANSACTIONS } from "../defs/routerPaths";
import AccountsIcon from "../resources/images/accounts.svg";
import PlusIcon from "../resources/images/plusIcon.svg";
import RecieptIcon from "../resources/images/reciept.svg";

import Button from "./common/Button";
import Drawer from "./common/Drawer";
import DrawerListItem from "./common/DrawerListItem";
import Icon from "./common/Icon";
import Modal from "./common/Modal";
import TransactionAddForm from "./forms/TransactionAddForm";

const DrawerButton = styled(Button)`
    margin: 16px;
`;

const VersionContainer = styled.div`
    margin: auto 16px 16px;
`;

const NavigationDrawer = (): JSX.Element => {
    const [isAddingTransaction, setIsAddingTransaction] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Drawer>
            <Modal
                visible={isAddingTransaction}
                onClose={() => {
                    setIsAddingTransaction(false);
                }}
            >
                <TransactionAddForm onSubmit={() => setIsAddingTransaction(false)} />
            </Modal>

            <DrawerButton onClick={() => setIsAddingTransaction(true)} icon={<PlusIcon />}>
                Add Transaction
            </DrawerButton>
            <DrawerListItem
                isHighlighted={location.pathname === TRANSACTIONS}
                isButton
                onClick={() => navigate(TRANSACTIONS)}
            >
                <Icon edge={"left"}>
                    <RecieptIcon />
                </Icon>
                Transactions
            </DrawerListItem>

            <DrawerListItem isHighlighted={location.pathname === ACCOUNTS} isButton onClick={() => navigate(ACCOUNTS)}>
                <Icon edge={"left"}>
                    <AccountsIcon />
                </Icon>
                Accounts
            </DrawerListItem>

            <VersionContainer>v{import.meta.env?.VITE_VERSION || "0.3.0"}</VersionContainer>
        </Drawer>
    );
};

export default NavigationDrawer;
