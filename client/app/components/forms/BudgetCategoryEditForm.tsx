import React, { useState, useEffect } from "react";

import formatMoney from "../../utils/formatMoney";
import { MonthCode } from "../../utils/getMonthCode";
import Button from "../common/Button";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import { useBudget } from "../../hooks/useBudget";

interface OwnProps {
    onSubmit?: () => void;
    budgetCategory: string;
    monthCode: MonthCode;
    defaultValue?: string;
}

interface FormValues {
    budgeted: string;
}

const BudgetCategoryEditForm = (props: OwnProps): JSX.Element => {
    const { editBudgetedAmount } = useBudget();

    const [values, setValues] = useState<FormValues>({
        budgeted: props.defaultValue || "",
    });

    useEffect(() => {
        setValues({ budgeted: props.defaultValue || "" });
    }, [props.defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ budgeted: event.target.value });
    };

    const formatMoneyOnBlur = () => {
        if (values.budgeted) {
            const formatted = formatMoney(values.budgeted, 2);
            setValues({ budgeted: formatted });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedBudgetAmount = parseFloat(values.budgeted || "0");
        editBudgetedAmount(props.monthCode, props.budgetCategory, isNaN(updatedBudgetAmount) ? 0 : updatedBudgetAmount);
        props.onSubmit && props.onSubmit();
    };

    return (
        <ModalFormContainer onSubmit={handleSubmit}>
            <Input
                name="budgeted"
                value={values.budgeted}
                onChange={handleChange}
                onBlur={formatMoneyOnBlur}
                label="Budgeted"
                autoFocus
                onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                    event.target.select();
                }}
            />
            <Button type={"submit"}>Add</Button>
        </ModalFormContainer>
    );
};

export default BudgetCategoryEditForm;
