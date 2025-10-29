import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";

import { MonthCode } from "../../utils/getMonthCode";
import Button from "../common/Button";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import { useBudget } from "../../hooks/useBudget";

interface OwnProps {
    onSubmit?: () => void;
    monthCode: MonthCode;
}

interface FormValues {
    groupName?: string;
}

const BudgetGroupAddForm = (props: OwnProps): JSX.Element => {
    const { addBudgetGroup } = useBudget();

    const handleAddCategoryGroup = (values: FormValues) => {
        if (values.groupName) {
            addBudgetGroup(props.monthCode, values.groupName);
        }
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
                                label="New Group"
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

export default BudgetGroupAddForm;
