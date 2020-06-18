import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import t from "../services/i18n/language";
import { addTransaction } from "../store/transactions/transactionActions";
import formatMoney from "../utils/formatMoney";

import Button from "./common/Button";
import Input from "./common/Input";

interface DispatchProps {
    addTransaction: typeof addTransaction;
}

interface FormValues {
    toFrom?: string;
    account?: string;
    category?: string;
    date?: string;
    inflow?: string;
    outflow?: string;
    note?: string;
}

type AllProps = ResolveThunks<DispatchProps>;

const TransactionAddContainer = styled.form`
    padding: 16px;
    display: flex;
    flex-direction: column;
`;

const TransactionAddForm = (props: AllProps): JSX.Element => {
    const handleSubmit = (values: FormValues) => {
        if (!values.toFrom || !values.account || !values.category || !values.date) {
            console.warn(t("didNotProvideAllValues"));
            return;
        }

        const inflow = parseFloat(values.inflow ? values.inflow : "0");
        const outflow = parseFloat(values.outflow ? values.outflow : "0");

        props.addTransaction(
            values.toFrom,
            values.account,
            values.category,
            new Date(values.date),
            (isNaN(inflow) ? inflow : 0) - (isNaN(outflow) ? outflow : 0),
            values.note,
        );
    };

    const handleValidation = (values: FormValues) => {
        const errors: FormValues = {};
        if (!values.toFrom) {
            errors.toFrom = t("cannotBeEmpty");
        }
        if (!values.account) {
            errors.account = t("cannotBeEmpty");
        }
        if (!values.category) {
            errors.category = t("cannotBeEmpty");
        }
        if (!values.date) {
            errors.date = t("cannotBeEmpty");
        }

        return errors;
    };

    return (
        <Form
            onSubmit={handleSubmit}
            validate={handleValidation}
            component={({ handleSubmit }: FormRenderProps) => (
                <TransactionAddContainer onSubmit={handleSubmit}>
                    <Field name={"toFrom"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("toFrom")}
                                {...input}
                            />
                        )}
                    </Field>
                    <Field name={"account"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("account")}
                                {...input}
                            />
                        )}
                    </Field>
                    <Field name={"category"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("category")}
                                {...input}
                            />
                        )}
                    </Field>
                    <Field name={"date"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("date")}
                                {...input}
                            />
                        )}
                    </Field>
                    <Field name={"in"} format={(value: string) => formatMoney(value, 2)} formatOnBlur>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("in")}
                                {...input}
                            />
                        )}
                    </Field>
                    <Field name={"out"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("out")}
                                {...input}
                            />
                        )}
                    </Field>
                    <Field name={"notes"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("notes")}
                                {...input}
                            />
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
