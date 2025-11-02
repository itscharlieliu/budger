import React, { useRef, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import styled from "styled-components";

import { Transaction } from "../../store/transactions/transactionInterfaces";
import formatMoney from "../../utils/formatMoney";
import { getMonthCodeFromDate, MonthCode } from "../../utils/getMonthCode";
import Button from "../common/Button";
import DateSelector from "../common/DateSelector";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import { useTransactions } from "../../hooks/useTransactions";

interface OwnProps {
    onSubmit: () => void;
}

interface FormValues {
    toFrom?: string;
    account?: string;
    category?: string;
    date?: Date;
    inFlow?: string;
    outFlow?: string;
    note?: string;
}

interface FormErrors {
    toFrom?: string;
    account?: string;
    category?: string;
    date?: string;
    inFlow?: string;
    outFlow?: string;
    note?: string;
}

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const AddFormButton = styled(Button)`
    margin: 16px 8px;
`;

const TransactionAddForm = (props: OwnProps): JSX.Element => {
    const { addTransaction } = useTransactions();
    const [monthCode, setMonthCode] = useState<MonthCode>(getMonthCodeFromDate(new Date()));

    const toFromInputRef = useRef<HTMLInputElement>(null);
    const accountInputRef = useRef<HTMLInputElement>(null);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const dateInputRef = useRef<DayPickerInput>(null);
    const outInputRef = useRef<HTMLInputElement>(null);

    const validate = (values: FormValues): FormErrors => {
        const errors: FormErrors = {};

        if (!values.toFrom) {
            errors.toFrom = "Required";
        }

        if (!values.account) {
            errors.account = "Required";
        }

        if (!values.category) {
            errors.category = "Required";
        }

        if (!values.date) {
            errors.date = "Required";
        }

        if (!values.inFlow && !values.outFlow) {
            errors.inFlow = "Required";
            errors.outFlow = "Required";
        }

        return errors;
    };

    const onSubmit = async (values: FormValues) => {
        const activity = (parseFloat(values.inFlow || "0") - parseFloat(values.outFlow || "0")) * 100;

        const transaction: Transaction = {
            account: values.account!,
            date: values.date!,
            payee: values.toFrom!,
            category: values.category!,
            note: values.note,
            activity,
        };

        await addTransaction(transaction);
        props.onSubmit();
    };

    return (
        <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, submitting }: FormRenderProps<FormValues>) => (
                <ModalFormContainer onSubmit={handleSubmit}>
                    <Field name={"toFrom"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                value={input.value || ""}
                                error={meta.touched && meta.error}
                                helperText={meta.touched && meta.error}
                                label="To / From"
                                onFocus={() => accountInputRef.current && accountInputRef.current.focus()}
                                ref={toFromInputRef}
                            />
                        )}
                    </Field>
                    <Field name={"account"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                value={input.value || ""}
                                error={meta.touched && meta.error}
                                helperText={meta.touched && meta.error}
                                label="Account"
                                onFocus={() => categoryInputRef.current && categoryInputRef.current.focus()}
                                ref={accountInputRef}
                            />
                        )}
                    </Field>
                    <Field name={"category"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                value={input.value || ""}
                                error={meta.touched && meta.error}
                                helperText={meta.touched && meta.error}
                                label="Category"
                                onFocus={() => dateInputRef.current && dateInputRef.current.getInput().focus()}
                                ref={categoryInputRef}
                            />
                        )}
                    </Field>
                    <Field name={"date"}>
                        {({ input, meta }: FieldRenderProps<Date, HTMLElement>) => {
                            return (
                                <DateSelector
                                    {...input}
                                    onBlur={(event: React.FocusEvent<HTMLDivElement>) => {
                                        input.value && setMonthCode(getMonthCodeFromDate(input.value));
                                        input.onBlur(event);
                                    }}
                                    value={input.value}
                                    error={meta.touched && meta.error}
                                    helperText={meta.touched && meta.error}
                                    onDayPickerHide={() => outInputRef.current && outInputRef.current.focus()}
                                    ref={dateInputRef}
                                />
                            );
                        }}
                    </Field>
                    <Field name={"outFlow"} format={(value: string) => formatMoney(value, 2)} formatOnBlur>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                value={input.value || ""}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label="Out"
                                ref={outInputRef}
                            />
                        )}
                    </Field>
                    <Field name={"inFlow"} format={(value: string) => formatMoney(value, 2)} formatOnBlur>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                value={input.value || ""}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label="In"
                            />
                        )}
                    </Field>
                    <Field name={"note"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label="Notes"
                            />
                        )}
                    </Field>

                    <ButtonContainer>
                        <AddFormButton type={"submit"}>Add</AddFormButton>
                        <AddFormButton type={"button"} onClick={() => props.onSubmit()}>
                            Cancel
                        </AddFormButton>
                    </ButtonContainer>
                </ModalFormContainer>
            )}
        />
    );
};

export default TransactionAddForm;