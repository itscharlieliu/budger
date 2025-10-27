import React, { useRef, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import styled from "styled-components";

import t from "../../services/i18n/language";
import { AllAccounts, BankAccount } from "../../store/accounts/accountsInterfaces";
import { TotalBudget } from "../../store/budget/budgetInterfaces";
import { Transaction } from "../../store/transactions/transactionInterfaces";
import formatMoney from "../../utils/formatMoney";
import { getMonthCodeFromDate, getMonthCodeString, MonthCode } from "../../utils/getMonthCode";
import Autocomplete, { AutocompleteOption } from "../common/Autocomplete";
import Button from "../common/Button";
import DateSelector from "../common/DateSelector";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import { useAccounts } from "../../hooks/useAccounts";
import { useBudget } from "../../hooks/useBudget";
import { useTransactions } from "../../hooks/useTransactions";

interface OwnProps {
    onSubmit: () => void;
}

interface FormValues {
    toFrom?: AutocompleteOption;
    account?: AutocompleteOption;
    category?: AutocompleteOption;
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
    const { allAccounts } = useAccounts();
    const { totalBudget } = useBudget();
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
            errors.toFrom = t("required");
        }

        if (!values.account) {
            errors.account = t("required");
        }

        if (!values.category) {
            errors.category = t("required");
        }

        if (!values.date) {
            errors.date = t("required");
        }

        if (!values.inFlow && !values.outFlow) {
            errors.inFlow = t("required");
            errors.outFlow = t("required");
        }

        return errors;
    };

    const onSubmit = (values: FormValues) => {
        const activity = (parseFloat(values.inFlow || "0") - parseFloat(values.outFlow || "0")) * 100;

        const transaction: Transaction = {
            account: values.account!.value,
            date: values.date!,
            payee: values.toFrom!.value,
            category: values.category!.value,
            note: values.note,
            activity,
        };

        addTransaction(transaction);
        props.onSubmit();
    };

    const getAccountOptions = (): AutocompleteOption[] => {
        return allAccounts.map((account: BankAccount) => ({
            value: account.name,
            label: account.name,
        }));
    };

    const getCategoryOptions = (): AutocompleteOption[] => {
        const monthCodeString = getMonthCodeString(monthCode);
        const monthlyBudget = totalBudget[monthCodeString];

        if (!monthlyBudget) {
            return [];
        }

        const categories: AutocompleteOption[] = [];

        for (const group of Object.keys(monthlyBudget)) {
            for (const category of Object.keys(monthlyBudget[group])) {
                categories.push({
                    value: category,
                    label: category,
                });
            }
        }

        return categories;
    };

    return (
        <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, submitting }: FormRenderProps<FormValues>) => (
                <ModalFormContainer onSubmit={handleSubmit}>
                    <Field name={"toFrom"}>
                        {({ input, meta }: FieldRenderProps<AutocompleteOption, HTMLElement>) => (
                            <Autocomplete
                                {...input}
                                value={input.value}
                                onChange={(value: AutocompleteOption | React.ChangeEvent<HTMLInputElement>) => {
                                    if ("value" in value) {
                                        input.onChange(value);
                                    }
                                }}
                                onBlur={input.onBlur}
                                options={[]}
                                error={meta.touched && meta.error}
                                helperText={meta.touched && meta.error}
                                label={t("toFrom")}
                                onFocus={() => accountInputRef.current && accountInputRef.current.focus()}
                                ref={toFromInputRef}
                            />
                        )}
                    </Field>
                    <Field name={"account"}>
                        {({ input, meta }: FieldRenderProps<AutocompleteOption, HTMLElement>) => (
                            <Autocomplete
                                {...input}
                                value={input.value}
                                onChange={(value: AutocompleteOption | React.ChangeEvent<HTMLInputElement>) => {
                                    if ("value" in value) {
                                        input.onChange(value);
                                    }
                                }}
                                onBlur={input.onBlur}
                                options={getAccountOptions()}
                                error={meta.touched && meta.error}
                                helperText={meta.touched && meta.error}
                                label={t("account")}
                                onFocus={() => categoryInputRef.current && categoryInputRef.current.focus()}
                                ref={accountInputRef}
                            />
                        )}
                    </Field>
                    <Field name={"category"}>
                        {({ input, meta }: FieldRenderProps<AutocompleteOption, HTMLElement>) => (
                            <Autocomplete
                                {...input}
                                value={input.value}
                                onChange={(value: AutocompleteOption | React.ChangeEvent<HTMLInputElement>) => {
                                    if ("value" in value) {
                                        input.onChange(value);
                                    }
                                }}
                                onBlur={input.onBlur}
                                options={getCategoryOptions()}
                                error={meta.touched && meta.error}
                                helperText={meta.touched && meta.error}
                                label={t("category")}
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
                                label={t("out")}
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
                                label={t("in")}
                            />
                        )}
                    </Field>
                    <Field name={"notes"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("notes")}
                            />
                        )}
                    </Field>

                    <ButtonContainer>
                        <AddFormButton type={"submit"}>{t("add")}</AddFormButton>
                        <AddFormButton type={"button"} onClick={() => props.onSubmit()}>
                            {t("cancel")}
                        </AddFormButton>
                    </ButtonContainer>
                </ModalFormContainer>
            )}
        />
    );
};

export default TransactionAddForm;