import React from "react";
import { Field, FieldRenderProps, Form, FormRenderProps } from "react-final-form";
import { connect, ResolveThunks } from "react-redux";

import t from "../../services/i18n/language";
import { editBudgetedAmount } from "../../store/budget/budgetActions";
import formatMoney from "../../utils/formatMoney";
import { MonthCode } from "../../utils/getMonthCode";
import Button from "../common/Button";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";

interface OwnProps {
    onSubmit?: () => void;
    budgetCategory: string;
    monthCode: MonthCode;
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
        props.editBudgetedAmount(
            props.monthCode,
            props.budgetCategory,
            isNaN(updatedBudgetAmount) ? 0 : updatedBudgetAmount,
        );
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
