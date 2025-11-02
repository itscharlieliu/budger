import React, { useState } from "react";

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
    categoryName: string;
}

const BudgetCategoryAddForm = (props: OwnProps): JSX.Element => {
    const { addBudgetCategory } = useBudget();

    const [values, setValues] = useState<FormValues>({
        categoryName: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ categoryName: event.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (values.categoryName) {
            addBudgetCategory(props.monthCode, props.group, values.categoryName);
        }
        props.onSubmit && props.onSubmit();
    };

    return (
        <ModalFormContainer onSubmit={handleSubmit}>
            <Input
                name="categoryName"
                value={values.categoryName}
                onChange={handleChange}
                label="New Category"
                autoFocus
            />
            <Button type={"submit"}>Add</Button>
        </ModalFormContainer>
    );
};

export default BudgetCategoryAddForm;
