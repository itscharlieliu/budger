import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";

import t from "../../services/i18n/language";
import { addBudgetCategory } from "../../store/budget/budgetActions";
import Button from "../common/Button";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";

interface OwnProps {
    onSubmit?: () => void;
    group: string;
}

interface DispatchProps {
    addBudgetCategory: typeof addBudgetCategory;
}

type AllProps = OwnProps & ResolveThunks<DispatchProps>;

interface FormValues {
    categoryName?: string;
}

const BudgetCategoryAddForm = (props: AllProps): JSX.Element => {
    const handleAddCategoryGroup = (values: FormValues) => {
        values.categoryName && props.addBudgetCategory(props.group, values.categoryName);
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

const mapDispatchToProps = {
    addBudgetCategory,
};

export default connect(null, mapDispatchToProps)(BudgetCategoryAddForm);
