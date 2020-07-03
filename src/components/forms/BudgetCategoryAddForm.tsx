import { addBudgetCategory, addBudgetGroup } from "../../store/budget/budgetActions";
import { connect, ResolveThunks } from "react-redux";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";

import React from "react";
import styled from "styled-components";
import Input from "../common/Input";
import t from "../../services/i18n/language";
import Button from "../common/Button";

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

const CategoryAddContainer = styled.form`
    padding: 16px;
    display: flex;
    flex-direction: column;
`;

const BudgetCategoryAddForm = (props: AllProps): JSX.Element => {
    const handleAddCategoryGroup = (values: FormValues) => {
        values.categoryName && props.addBudgetCategory(props.group, values.categoryName);
        props.onSubmit && props.onSubmit();
    };

    return (
        <Form
            onSubmit={handleAddCategoryGroup}
            component={({ handleSubmit }: FormRenderProps) => (
                <CategoryAddContainer onSubmit={handleSubmit}>
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
                </CategoryAddContainer>
            )}
        />
    );
};

const mapDispatchToProps = {
    addBudgetCategory,
};

export default connect(null, mapDispatchToProps)(BudgetCategoryAddForm);
