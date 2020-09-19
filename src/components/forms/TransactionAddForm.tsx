import React, { useRef } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { AllAccounts, BankAccount } from "../../store/accounts/accountsInterfaces";
import { TotalBudget } from "../../store/budget/budgetInterfaces";
import { addTransaction } from "../../store/transactions/transactionActions";
import formatMoney from "../../utils/formatMoney";
import Autocomplete, { AutocompleteOption } from "../common/Autocomplete";
import Button from "../common/Button";
import DateSelector from "../common/DateSelector";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";

import getMonthCode from "../../utils/getMonthCode";

interface StateProps {
    allAccounts: AllAccounts;
    totalBudget: TotalBudget;
}

interface DispatchProps {
    addTransaction: typeof addTransaction;
}

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

type AllProps = OwnProps & StateProps & ResolveThunks<DispatchProps>;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const AddFormButton = styled(Button)`
    margin: 4px;
`;

const TransactionAddForm = (props: AllProps): JSX.Element => {
    const accountInputRef = useRef<HTMLInputElement>(null);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const dateInputRef = useRef<DayPickerInput>(null);
    const outInputRef = useRef<HTMLInputElement>(null);

    const currentMonthCode = getMonthCode(new Date());

    const handleSubmit = (values: FormValues) => {
        if (!values.toFrom || !values.account || !values.category || !values.date) {
            console.warn(t("didNotProvideAllValues"));
            return;
        }

        const inflow = parseFloat(values.inFlow ? values.inFlow : "0");
        const outflow = parseFloat(values.outFlow ? values.outFlow : "0");

        props.addTransaction(
            values.toFrom.value,
            values.account.value,
            values.category.value,
            values.date,
            (isNaN(inflow) ? 0 : inflow) - (isNaN(outflow) ? 0 : outflow),
            values.note,
        );
        props.onSubmit();
    };

    const handleValidation = (values: FormValues) => {
        const errors: FormErrors = {};

        if (!values.toFrom || (values.toFrom.label === "" && values.toFrom.value === "")) {
            errors.toFrom = t("cannotBeEmpty");
        }
        if (!values.account) {
            errors.account = t("cannotBeEmpty");
        }
        if (!values.category) {
            errors.category = t("cannotBeEmpty");
        }
        if (!values.date) {
            errors.date = t("invalidDate");
        }

        if (
            !props.allAccounts.some((account: BankAccount) => values.account && account.name === values.account.value)
        ) {
            errors.account = t("accountDoesNotExist");
        }

        return errors;
    };

    return (
        <Form
            onSubmit={handleSubmit}
            validate={handleValidation}
            component={({ handleSubmit }: FormRenderProps) => (
                <ModalFormContainer onSubmit={handleSubmit}>
                    <Field name={"toFrom"}>
                        {({ input, meta }: FieldRenderProps<AutocompleteOption, HTMLElement>) => (
                            <Autocomplete
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("toFrom")}
                                autoFocus
                                value={input.value || { value: "", label: "" }}
                                options={[]}
                                onSelectedItemChange={() => accountInputRef.current && accountInputRef.current.focus()}
                            />
                        )}
                    </Field>
                    <Field name={"account"}>
                        {({ input, meta }: FieldRenderProps<AutocompleteOption, HTMLElement>) => (
                            <Autocomplete
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("account")}
                                value={input.value || { value: "", label: "" }}
                                options={props.allAccounts.map((account: BankAccount) => ({
                                    value: account.name,
                                    label: account.name,
                                }))}
                                onSelectedItemChange={() =>
                                    categoryInputRef.current && categoryInputRef.current.focus()
                                }
                                ref={accountInputRef}
                            />
                        )}
                    </Field>
                    <Field name={"category"}>
                        {({ input, meta }: FieldRenderProps<AutocompleteOption, HTMLElement>) => (
                            <Autocomplete
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("category")}
                                value={input.value || { value: "", label: "" }}
                                options={Object.keys(
                                    props.totalBudget[currentMonthCode] ? props.totalBudget[currentMonthCode] : {},
                                ).reduce((categories: AutocompleteOption[], budgetGroup: string) => {
                                    for (const category of Object.keys(
                                        props.totalBudget[currentMonthCode][budgetGroup],
                                    )) {
                                        categories.push({ value: category, label: category });
                                    }
                                    return categories;
                                }, [])}
                                onSelectedItemChange={() =>
                                    dateInputRef.current && dateInputRef.current.getInput().focus()
                                }
                                ref={categoryInputRef}
                            />
                        )}
                    </Field>
                    <Field name={"date"}>
                        {({ input, meta }: FieldRenderProps<Date, HTMLElement>) => {
                            return (
                                <DateSelector
                                    {...input}
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

const mapStateToProps = (state: ApplicationState): StateProps => ({
    allAccounts: state.accounts.allAccounts,
    totalBudget: state.budget.totalBudget,
});

const mapDispatchToProps = {
    addTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionAddForm);
