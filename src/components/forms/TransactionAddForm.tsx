import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";

import t from "../../services/i18n/language";
import { addTransaction } from "../../store/transactions/transactionActions";
import formatMoney from "../../utils/formatMoney";
import Button from "../common/Button";
import DateSelector from "../common/DateSelector";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import Autocomplete, { AutocompleteOption, AutocompleteProps } from "../common/Autocomplete";
import { AllAccounts, BankAccount } from "../../store/accounts/accountsInterfaces";
import ApplicationState from "../../store";

interface StateProps {
    allAccounts: AllAccounts;
}

interface DispatchProps {
    addTransaction: typeof addTransaction;
}

interface FormValues {
    toFrom?: AutocompleteOption;
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

type AllProps = StateProps & ResolveThunks<DispatchProps>;

const TransactionAddForm = (props: AllProps): JSX.Element => {
    const handleSubmit = (values: FormValues) => {
        if (!values.toFrom || !values.account || !values.category || !values.date) {
            console.warn(t("didNotProvideAllValues"));
            return;
        }

        const inflow = parseFloat(values.inFlow ? values.inFlow : "0");
        const outflow = parseFloat(values.outFlow ? values.outFlow : "0");

        props.addTransaction(
            values.toFrom.value,
            values.account,
            values.category,
            values.date,
            (isNaN(inflow) ? 0 : inflow) - (isNaN(outflow) ? 0 : outflow),
            values.note,
        );
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
            errors.date = t("cannotBeEmpty");
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
                                options={[
                                    { value: "test1", label: "hello" },
                                    { value: "test2", label: "world" },
                                ]}
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
                            />
                        )}
                    </Field>
                    <Field name={"category"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("category")}
                            />
                        )}
                    </Field>
                    <Field name={"date"}>
                        {({ input }: FieldRenderProps<Date, HTMLElement>) => (
                            // TODO Add meta properties
                            <DateSelector {...input} value={input.value} />
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
                    <Field name={"outFlow"} format={(value: string) => formatMoney(value, 2)} formatOnBlur>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                value={input.value || ""}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("out")}
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

                    <Button type={"submit"}>add</Button>
                    <Button type={"button"}>cancel</Button>
                </ModalFormContainer>
            )}
        />
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    allAccounts: state.accounts.allAccounts,
});

const mapDispatchToProps = {
    addTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionAddForm);
