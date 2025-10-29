import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";

import t from "../../services/i18n/language";
import { MonthCode } from "../../utils/getMonthCode";
import Button from "../common/Button";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import { useBudget } from "../../hooks/useBudget";

interface OwnProps {
    onSubmit?: () => void;
    group: string;
    monthCode: MonthCode;
}

interface FormValues {
    categoryName?: string;
}

const BudgetCategoryAddForm = (props: OwnProps): JSX.Element => {
    const { addBudgetCategory } = useBudget();

    const handleAddCategoryGroup = (values: FormValues) => {
        if (values.categoryName) {
            addBudgetCategory(props.monthCode, props.group, values.categoryName);
        }
        props.onSubmit && props.onSubmit();
    };

    return (
        <Form
            onSubmit={handleAddCategoryGroup}
            component={({ handleSubmit }: FormRenderProps) => (
                <ModalFormContainer onSubmit={handleSubmit}>
                    <Field name={"categoryName"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("newCategory")}
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

export default BudgetCategoryAddForm;
