import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";

import t from "../../services/i18n/language";
import { AccountType, BankAccount } from "../../store/accounts/accountsInterfaces";
import formatMoney from "../../utils/formatMoney";
import Button from "../common/Button";
import Input from "../common/Input";
import Switch from "../common/Switch";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import { useAccounts } from "../../hooks/useAccounts";

interface OwnProps {
    onSubmit?: () => void;
}

interface FormValues {
    accountName?: string;
    budgeted?: boolean;
    startingBalance?: string;
}

interface FormErrors {
    accountName?: string;
    budgeted?: string;
    startingBalance?: string;
}

const AccountAddForm = (props: OwnProps): JSX.Element => {
    const { addAccount } = useAccounts();

    const handleAddAccount = (values: FormValues) => {
        const startingBalance = parseFloat(values.startingBalance ? values.startingBalance : "0");

        if (values.accountName) {
            const account: BankAccount = {
                name: values.accountName,
                type: values.budgeted ? AccountType.budgeted : AccountType.unbudgeted,
                cachedBalance: isNaN(startingBalance) ? 0 : startingBalance,
            };
            addAccount(account);
        }
        props.onSubmit && props.onSubmit();
    };

    const handleValidation = (values: FormValues) => {
        const errors: FormErrors = {};

        if (!values.accountName) {
            errors.accountName = t("cannotBeEmpty");
        }

        return errors;
    };

    return (
        <Form
            onSubmit={handleAddAccount}
            validate={handleValidation}
            component={({ handleSubmit }: FormRenderProps) => (
                <ModalFormContainer onSubmit={handleSubmit}>
                    <Field name={"accountName"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("accountName")}
                                autoFocus
                            />
                        )}
                    </Field>
                    <Field name={"budgeted"} type={"checkbox"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Switch {...input} spaced error={meta.touched && meta.error} label={t("budgeted")} />
                        )}
                    </Field>
                    <Field name={"startingBalance"} format={(value: string) => formatMoney(value, 2)} formatOnBlur>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("startingBalance")}
                            />
                        )}
                    </Field>
                    <Button type={"submit"}>Add</Button>
                </ModalFormContainer>
            )}
        />
    );
};

export default AccountAddForm;
