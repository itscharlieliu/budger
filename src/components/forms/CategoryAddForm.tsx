import { addCategory } from "../../store/budget/budgetActions";
import { connect, ResolveThunks } from "react-redux";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";

import React from "react";
import styled from "styled-components";
import Input from "../common/Input";
import t from "../../services/i18n/language";

interface DispathProps {
    addCategory: typeof addCategory;
}

type AllProps = ResolveThunks<DispathProps>;

const CategoryAddContainer = styled.form`
    padding: 16px;
    display: flex;
    flex-direction: column;
`;

const CategoryAddForm = (props: AllProps): JSX.Element => {
    return (
        <Form
            onSubmit={() => console.log("submitting")}
            component={({ handleSubmit }: FormRenderProps) => (
                <CategoryAddContainer onSubmit={handleSubmit}>
                    <Field name={"categoryName"}>
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("toFrom")}
                            />
                        )}
                    </Field>
                </CategoryAddContainer>
            )}
        />
    );
};

const mapDispatchToProps = {
    addCategory,
};

export default connect(null, mapDispatchToProps)(CategoryAddForm);
