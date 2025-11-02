import React, { useState } from "react";

import { BankAccount } from "../../store/accounts/accountsInterfaces";
import formatMoney from "../../utils/formatMoney";
import Button from "../common/Button";
import Input from "../common/Input";
import ModalFormContainer from "../common/containers/ModalFormContainer";
import { useAccounts } from "../../hooks/useAccounts";

interface OwnProps {
    onSubmit?: () => void;
}

interface FormValues {
    accountName: string;
    startingBalance: string;
}

interface FormErrors {
    accountName?: string;
    startingBalance?: string;
}

const AccountAddForm = (props: OwnProps): JSX.Element => {
    const { addAccount } = useAccounts();

    const [values, setValues] = useState<FormValues>({
        accountName: "",
        startingBalance: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleValidation = (vals: FormValues): FormErrors => {
        const errs: FormErrors = {};

        if (!vals.accountName) {
            errs.accountName = "This field cannot be empty";
        }

        return errs;
    };

    const handleChange = (name: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValues((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const newErrors = handleValidation({ ...values, [name]: value as any });
            setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
        }
    };

    const handleBlur = (name: keyof FormValues) => () => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const newErrors = handleValidation(values);
        setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    };

    const formatMoneyOnBlur = () => {
        if (values.startingBalance) {
            const formatted = formatMoney(values.startingBalance, 2);
            setValues((prev) => ({ ...prev, startingBalance: formatted }));
        }
        handleBlur("startingBalance")();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = handleValidation(values);
        setErrors(newErrors);
        setTouched({
            accountName: true,
            startingBalance: true,
        });

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const startingBalance = parseFloat(values.startingBalance || "0");

        const account: BankAccount = {
            name: values.accountName,
            cachedBalance: isNaN(startingBalance) ? 0 : startingBalance,
            accountType: "checking", // Default account type, you may want to make this configurable
        };
        await addAccount(account);
        props.onSubmit && props.onSubmit();
    };

    return (
        <ModalFormContainer onSubmit={handleSubmit}>
            <Input
                name="accountName"
                value={values.accountName}
                onChange={handleChange("accountName")}
                onBlur={handleBlur("accountName")}
                helperText={touched.accountName ? errors.accountName : undefined}
                error={touched.accountName && !!errors.accountName}
                label="Account Name"
                autoFocus
            />
            <Input
                name="startingBalance"
                value={values.startingBalance}
                onChange={handleChange("startingBalance")}
                onBlur={formatMoneyOnBlur}
                helperText={touched.startingBalance ? errors.startingBalance : undefined}
                error={touched.startingBalance && !!errors.startingBalance}
                label="Starting Balance"
            />
            <Button type={"submit"}>Add</Button>
        </ModalFormContainer>
    );
};

export default AccountAddForm;
