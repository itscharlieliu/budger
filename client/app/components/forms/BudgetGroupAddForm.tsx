import React, { useState } from "react";

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
    groupName: string;
}

const BudgetGroupAddForm = (props: OwnProps): JSX.Element => {
    const { addBudgetGroup } = useBudget();

    const [values, setValues] = useState<FormValues>({
        groupName: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ groupName: event.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (values.groupName) {
            addBudgetGroup(props.monthCode, values.groupName);
        }
        props.onSubmit && props.onSubmit();
    };

    return (
        <ModalFormContainer onSubmit={handleSubmit}>
            <Input name="groupName" value={values.groupName} onChange={handleChange} label="New Group" autoFocus />
            <Button type={"submit"}>Add</Button>
        </ModalFormContainer>
    );
};

export default BudgetGroupAddForm;
