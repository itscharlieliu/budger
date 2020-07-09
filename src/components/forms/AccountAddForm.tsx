import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";

import t from "../../services/i18n/language";
import { addAccount } from "../../store/accounts/accountsActions";
import { AccountType } from "../../store/accounts/accountsInterfaces";
import formatMoney from "../../utils/formatMoney";
import Button from "../common/Button";
import Input from "../common/Input";
import Switch from "../common/Switch";
import ModalFormContainer from "../common/containers/ModalFormContainer";

interface OwnProps {
    onSubmit?: () => void;
}

interface DispatchProps {
    addAccount: typeof addAccount;
}

type AllProps = OwnProps & ResolveThunks<DispatchProps>;

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

const AccountAddForm = (props: AllProps): JSX.Element => {
    const handleAddAccount = (values: FormValues) => {
        const startingBalace = parseFloat(values.startingBalance ? values.startingBalance : "0");

        values.accountName &&
            props.addAccount(
                values.accountName,
                values.budgeted ? AccountType.budgeted : AccountType.unbudgeted,
                isNaN(startingBalace) ? 0 : startingBalace,
            );
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

const mapDispatchToProps = {
    addAccount,
};

export default connect(null, mapDispatchToProps)(AccountAddForm);
