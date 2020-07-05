import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";

import t from "../../services/i18n/language";
import { addAccount } from "../../store/accounts/accountsActions";
import Button from "../common/Button";
import Input from "../common/Input";
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
}

const AccountAddForm = (props: AllProps): JSX.Element => {
    const handleAddAccount = (values: FormValues) => {
        values.accountName && props.addAccount(values.accountName);
        props.onSubmit && props.onSubmit();
    };
    return (
        <Form
            onSubmit={handleAddAccount}
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
