import React, { useRef, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import styled from "styled-components";

import { Transaction } from "../../store/transactions/transactionInterfaces";
import formatMoney from "../../utils/formatMoney";
import { getMonthCodeFromDate, MonthCode } from "../../utils/getMonthCode";
import Button from "../common/Button";
import DateSelector from "../common/DateSelector";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import { useTransactions } from "../../hooks/useTransactions";

interface OwnProps {
    onSubmit: () => void;
}

interface FormValues {
    toFrom: string;
    account: string;
    category: string;
    date: Date | undefined;
    inFlow: string;
    outFlow: string;
    note: string;
}

interface FormErrors {
    toFrom?: string;
    account?: string;
    category?: string;
    date?: string;
    inFlow?: string;
    outFlow?: string;
    note?: string;
}

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const AddFormButton = styled(Button)`
    margin: 16px 8px;
`;

const TransactionAddForm = (props: OwnProps): JSX.Element => {
    const { addTransaction } = useTransactions();
    const [monthCode, setMonthCode] = useState<MonthCode>(getMonthCodeFromDate(new Date()));

    const [values, setValues] = useState<FormValues>({
        toFrom: "",
        account: "",
        category: "",
        date: undefined,
        inFlow: "",
        outFlow: "",
        note: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const toFromInputRef = useRef<HTMLInputElement>(null);
    const accountInputRef = useRef<HTMLInputElement>(null);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const dateInputRef = useRef<DayPickerInput>(null);
    const outInputRef = useRef<HTMLInputElement>(null);

    const validate = (vals: FormValues): FormErrors => {
        const errs: FormErrors = {};

        if (!vals.toFrom) {
            errs.toFrom = "Required";
        }

        if (!vals.account) {
            errs.account = "Required";
        }

        if (!vals.category) {
            errs.category = "Required";
        }

        if (!vals.date) {
            errs.date = "Required";
        }

        if (!vals.inFlow && !vals.outFlow) {
            errs.inFlow = "Required";
            errs.outFlow = "Required";
        }

        return errs;
    };

    const handleChange = (name: keyof FormValues) => (
        event: React.ChangeEvent<HTMLInputElement> | { target: { value: Date } },
    ) => {
        const value = event.target.value;
        setValues((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const newErrors = validate({ ...values, [name]: value });
            setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
        }
    };

    const handleBlur = (name: keyof FormValues) => () => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const newErrors = validate(values);
        setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    };

    const formatMoneyOnBlur = (name: "inFlow" | "outFlow") => () => {
        const value = values[name];
        if (value) {
            const formatted = formatMoney(value, 2);
            setValues((prev) => ({ ...prev, [name]: formatted }));
        }
        handleBlur(name)();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate(values);
        setErrors(newErrors);
        setTouched({
            toFrom: true,
            account: true,
            category: true,
            date: true,
            inFlow: true,
            outFlow: true,
            note: true,
        });

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const activity = (parseFloat(values.inFlow || "0") - parseFloat(values.outFlow || "0")) * 100;

        const transaction: Transaction = {
            account: values.account,
            date: values.date!,
            payee: values.toFrom,
            category: values.category,
            note: values.note,
            activity,
        };

        await addTransaction(transaction);
        props.onSubmit();
    };

    return (
        <ModalFormContainer onSubmit={handleSubmit}>
            <Input
                name="toFrom"
                value={values.toFrom}
                onChange={handleChange("toFrom")}
                onBlur={handleBlur("toFrom")}
                error={touched.toFrom && !!errors.toFrom}
                helperText={touched.toFrom ? errors.toFrom : undefined}
                label="To / From"
                onFocus={() => accountInputRef.current && accountInputRef.current.focus()}
                ref={toFromInputRef}
            />
            <Input
                name="account"
                value={values.account}
                onChange={handleChange("account")}
                onBlur={handleBlur("account")}
                error={touched.account && !!errors.account}
                helperText={touched.account ? errors.account : undefined}
                label="Account"
                onFocus={() => categoryInputRef.current && categoryInputRef.current.focus()}
                ref={accountInputRef}
            />
            <Input
                name="category"
                value={values.category}
                onChange={handleChange("category")}
                onBlur={handleBlur("category")}
                error={touched.category && !!errors.category}
                helperText={touched.category ? errors.category : undefined}
                label="Category"
                onFocus={() => dateInputRef.current && dateInputRef.current.getInput().focus()}
                ref={categoryInputRef}
            />
            <DateSelector
                onChange={
                    ((event: { target: { value: Date } }) => {
                        const value = event.target.value;
                        setValues((prev) => {
                            if (value) {
                                setMonthCode(getMonthCodeFromDate(value));
                            }
                            return { ...prev, date: value };
                        });
                        if (touched.date) {
                            const newErrors = validate({ ...values, date: value });
                            setErrors((prev) => ({ ...prev, date: newErrors.date }));
                        }
                    }) as any
                }
                onBlur={(event: React.FocusEvent<HTMLDivElement>) => {
                    if (values.date) {
                        setMonthCode(getMonthCodeFromDate(values.date));
                    }
                    handleBlur("date")();
                }}
                value={values.date}
                error={touched.date && !!errors.date}
                helperText={touched.date ? errors.date : undefined}
                onDayPickerHide={() => outInputRef.current && outInputRef.current.focus()}
                ref={dateInputRef}
            />
            <Input
                name="outFlow"
                value={values.outFlow}
                onChange={handleChange("outFlow")}
                onBlur={formatMoneyOnBlur("outFlow")}
                error={touched.outFlow && !!errors.outFlow}
                helperText={touched.outFlow ? errors.outFlow : undefined}
                label="Out"
                ref={outInputRef}
            />
            <Input
                name="inFlow"
                value={values.inFlow}
                onChange={handleChange("inFlow")}
                onBlur={formatMoneyOnBlur("inFlow")}
                error={touched.inFlow && !!errors.inFlow}
                helperText={touched.inFlow ? errors.inFlow : undefined}
                label="In"
            />
            <Input
                name="note"
                value={values.note}
                onChange={handleChange("note")}
                onBlur={handleBlur("note")}
                error={touched.note && !!errors.note}
                helperText={touched.note ? errors.note : undefined}
                label="Notes"
            />

            <ButtonContainer>
                <AddFormButton type={"submit"}>Add</AddFormButton>
                <AddFormButton type={"button"} onClick={() => props.onSubmit()}>
                    Cancel
                </AddFormButton>
            </ButtonContainer>
        </ModalFormContainer>
    );
};

export default TransactionAddForm;