import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import t from "../../services/i18n/language";
import { addBudgetGroup } from "../../store/budget/budgetActions";
import Button from "../common/Button";
import Input from "../common/Input";

interface OwnProps {
    onSubmit?: () => void;
}

interface DispatchProps {
    addBudgetGroup: typeof addBudgetGroup;
}

type AllProps = OwnProps & ResolveThunks<DispatchProps>;

interface FormValues {
    groupName?: string;
}

const CategoryAddContainer = styled.form`
    padding: 16px;
    display: flex;
    flex-direction: column;
`;

const BudgetGroupAddForm = (props: AllProps): JSX.Element => {
    const handleAddCategoryGroup = (values: FormValues) => {
        values.groupName && props.addBudgetGroup(values.groupName);
        props.onSubmit && props.onSubmit();
    };

    return (
        <Form
            onSubmit={handleAddCategoryGroup}
            component={({ handleSubmit }: FormRenderProps) => (
                <CategoryAddContainer onSubmit={handleSubmit}>
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
                </CategoryAddContainer>
            )}
        />
    );
};

const mapDispatchToProps = {
    addBudgetGroup,
};

export default connect(null, mapDispatchToProps)(BudgetGroupAddForm);
