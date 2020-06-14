import styled from "styled-components";
import React, { FormEvent, useState } from "react";
import Input from "./common/Input";
import t from "../services/i18n/language";
import Button from "./common/Button";
import { addTransaction } from "../store/transactions/transactionActions";
import { connect, ResolveThunks } from "react-redux";

interface DispatchProps {
    addTransaction: typeof addTransaction;
}

type AllProps = ResolveThunks<DispatchProps>;

const TransactionAddContainer = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const TransactionAddForm = (props: AllProps): JSX.Element => {
    const [toFrom, setToFrom] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [inflow, setInflow] = useState<number>(0);
    const [outflow, setOutflow] = useState<number>(0);
    const [note, setNote] = useState<string>("");

    const handleAddButtonPress = () => {
        props.addTransaction(toFrom, account, category, new Date(date), inflow - outflow, note);
    };

    return (
        <TransactionAddContainer>
            <Input
                placeholder={t("toFrom")}
                value={toFrom}
                onChange={(event: FormEvent) => setToFrom((event.target as HTMLInputElement).value)}
            />
            <Input
                placeholder={t("account")}
                value={account}
                onChange={(event: FormEvent) => setAccount((event.target as HTMLInputElement).value)}
            />
            <Input
                placeholder={t("category")}
                value={category}
                onChange={(event: FormEvent) => setCategory((event.target as HTMLInputElement).value)}
            />
            <Input
                placeholder={t("date")}
                value={date}
                onChange={(event: FormEvent) => setDate((event.target as HTMLInputElement).value)}
            />
            <Input
                placeholder={t("in")}
                type={"number"}
                value={inflow}
                onChange={(event: FormEvent) => setInflow(parseInt((event.target as HTMLInputElement).value))}
            />
            <Input
                placeholder={t("out")}
                value={outflow}
                onChange={(event: FormEvent) => setOutflow(parseInt((event.target as HTMLInputElement).value))}
            />
            <Input
                placeholder={t("notes")}
                value={note}
                onChange={(event: FormEvent) => setNote((event.target as HTMLInputElement).value)}
            />
            <Button onClick={handleAddButtonPress}>add</Button>
            <Button>cancel</Button>
        </TransactionAddContainer>
    );
};

const mapDispatchToProps = {
    addTransaction,
};

export default connect(null, mapDispatchToProps)(TransactionAddForm);
