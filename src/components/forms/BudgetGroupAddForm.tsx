import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";

import t from "../../services/i18n/language";
import { addBudgetGroup } from "../../store/budget/budgetActions";
import Button from "../common/Button";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";

interface OwnProps {
    onSubmit?: () => void;
    monthCode: string;
}

interface DispatchProps {
    addBudgetGroup: typeof addBudgetGroup;
}

type AllProps = OwnProps & ResolveThunks<DispatchProps>;

interface FormValues {
    groupName?: string;
}

const BudgetGroupAddForm = (props: AllProps): JSX.Element => {
    const handleAddCategoryGroup = (values: FormValues) => {
        console.log(props);

        values.groupName && props.addBudgetGroup(props.monthCode, values.groupName);
        props.onSubmit && props.onSubmit();
    };

    return (
        <Form
            onSubmit={handleAddCategoryGroup}
            component={({ handleSubmit }: FormRenderProps) => (
                <ModalFormContainer onSubmit={handleSubmit}>
                    <Field name={"groupName"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("newGroup")}
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
    addBudgetGroup,
};

export default connect(null, mapDispatchToProps)(BudgetGroupAddForm);
