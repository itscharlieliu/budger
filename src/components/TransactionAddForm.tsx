import React, { useState } from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import t from "../services/i18n/language";
import { addTransaction } from "../store/transactions/transactionActions";

import Button from "./common/Button";
import Input from "./common/Input";

interface DispatchProps {
    addTransaction: typeof addTransaction;
}

type AllProps = ResolveThunks<DispatchProps>;

const TransactionAddContainer = styled.form`
    padding: 16px;
    display: flex;
    flex-direction: row;
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

    const handleValidation = (values: { [key: string]: string }) => {
        const errors: { [key: string]: string } = {};
        console.log("validating...");
        console.log(values);
        if (!values.toFrom) {
            errors["toFrom"] = t("cannotBeEmpty");
        }

        return errors;
    };

    return (
        <Form
            onSubmit={(everything) => console.log(everything)}
            validate={handleValidation}
            component={({ handleSubmit }: FormRenderProps) => (
                <TransactionAddContainer onSubmit={handleSubmit}>
                    <Field name={"toFrom"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input helperText={meta.error} error={meta.error} label={t("toFrom")} {...input} />
                        )}
                    </Field>
                    <Field name={"account"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input label={t("account")} error={meta.error} {...input} />
                        )}
                    </Field>
                    <Field name={"category"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input label={t("category")} error={meta.error} {...input} />
                        )}
                    </Field>
                    <Field name={"date"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input label={t("date")} error={meta.error} {...input} />
                        )}
                    </Field>
                    <Field name={"in"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input label={t("in")} error={meta.error} {...input} />
                        )}
                    </Field>
                    <Field name={"out"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input label={t("out")} error={meta.error} {...input} />
                        )}
                    </Field>
                    <Field name={"notes"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input label={t("notes")} error={meta.error} {...input} />
                        )}
                    </Field>

                    <Button type={"submit"}>add</Button>
                    <Button type={"button"}>cancel</Button>
                </TransactionAddContainer>
            )}
        />
    );
};

const mapDispatchToProps = {
    addTransaction,
};

export default connect(null, mapDispatchToProps)(TransactionAddForm);
