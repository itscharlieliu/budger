import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import Input from "../common/Input";
import t from "../../services/i18n/language";
import Button from "../common/Button";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { addBudgetCategory, editBudgetedAmount } from "../../store/budget/budgetActions";
import formatMoney from "../../utils/formatMoney";

interface OwnProps {
    onSubmit?: () => void;
    budgetCategory: string;
    defaultValue?: string;
}

interface DispatchProps {
    editBudgetedAmount: typeof editBudgetedAmount;
}

type AllProps = OwnProps & ResolveThunks<DispatchProps>;

interface FormValues {
    budgeted?: string;
}
const BudgetCategoryEditForm = (props: AllProps): JSX.Element => {
    const handleAddCategoryGroup = (values: FormValues) => {
        const updatedBudgetAmount = parseFloat(values.budgeted ? values.budgeted : "0");
        props.editBudgetedAmount(props.budgetCategory, isNaN(updatedBudgetAmount) ? 0 : updatedBudgetAmount);
        props.onSubmit && props.onSubmit();
    };

    return (
        <Form
            onSubmit={handleAddCategoryGroup}
            component={({ handleSubmit }: FormRenderProps) => (
                <ModalFormContainer onSubmit={handleSubmit}>
                    <Field
                        name={"budgeted"}
                        defaultValue={props.defaultValue}
                        format={(value: string) => formatMoney(value, 2)}
                        formatOnBlur
                    >
                        {({ input, meta }: FieldRenderProps<string, HTMLElement>) => (
                            <Input
                                {...input}
                                helperText={meta.touched && meta.error}
                                error={meta.touched && meta.error}
                                label={t("budgeted")}
                                autoFocus
                                onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                                    event.target.select();
                                    input.onFocus(event);
                                }}
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
    editBudgetedAmount,
};

export default connect(null, mapDispatchToProps)(BudgetCategoryEditForm);
