import React, { useRef, useState, useEffect } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "../../defs/urls";
import { theme } from "../../defs/theme";

interface OwnProps {
    onSubmit: () => void;
}

interface Account {
    id: number;
    name: string;
}

interface FormValues {
    toFrom: string;
    account_id: string;
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

const SelectContainer = styled.div<{ error?: boolean }>`
    display: flex;
    flex-direction: column;
    margin: 4px;
    color: ${(props): string => (props.error ? theme.palette.error.main : theme.palette.background.contrast)};
`;

const SelectElement = styled.select<{ error?: boolean }>`
    outline: none;
    font-size: 1em;
    border-width: 2px;
    border-style: none none solid none;
    border-color: ${(props): string => (props.error ? theme.palette.error.light : theme.palette.input.inactive)};
    background-color: ${theme.palette.input.background};
    padding: 8px 0;
    cursor: pointer;

    &:focus {
        border-color: ${(props): string => (props.error ? theme.palette.error.main : theme.palette.input.active)};
    }

    transition: border-bottom-color 0.2s;
`;

const LabelText = styled.span<{ focused: boolean; error?: boolean }>`
    display: inline-block;
    overflow: visible;
    height: 1em;
    font-weight: ${theme.font.weight.bold};
    color: ${(props): string => {
        if (props.error) {
            return props.focused ? theme.palette.error.main : theme.palette.error.light;
        }
        return props.focused ? theme.palette.input.active : theme.palette.input.inactive;
    }};
    transform-origin: left;
    transform: ${(props): string => (props.focused ? "scale(.75)" : "translateY(calc(8px + 1em))")};

    transition: transform 0.2s, font-size 0.2s, color 0.2s;
`;

const HelpText = styled.span`
    font-size: 0.75em;
    word-wrap: break-word;
    height: 1em;
    overflow: visible;
`;

const TransactionAddForm = (props: OwnProps): JSX.Element => {
    const { addTransaction } = useTransactions();
    const { token } = useAuth();
    const [monthCode, setMonthCode] = useState<MonthCode>(getMonthCodeFromDate(new Date()));
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

    const [values, setValues] = useState<FormValues>({
        toFrom: "",
        account_id: "",
        category: "",
        date: undefined,
        inFlow: "",
        outFlow: "",
        note: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [accountFocused, setAccountFocused] = useState(false);

    const toFromInputRef = useRef<HTMLInputElement>(null);
    const accountSelectRef = useRef<HTMLSelectElement>(null);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const dateInputRef = useRef<DayPickerInput>(null);
    const outInputRef = useRef<HTMLInputElement>(null);

    // Fetch accounts on mount
    useEffect(() => {
        if (!token) {
            setIsLoadingAccounts(false);
            return;
        }

        const fetchAccounts = async () => {
            try {
                const response = await fetch(`${API_URL}/accounts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.success && Array.isArray(data.data)) {
                    setAccounts(data.data);
                } else {
                    console.error("Failed to load accounts:", data.error);
                }
            } catch (error) {
                console.error("Error fetching accounts:", error);
            } finally {
                setIsLoadingAccounts(false);
            }
        };

        fetchAccounts();
    }, [token]);

    const validate = (vals: FormValues): FormErrors => {
        const errs: FormErrors = {};

        if (!vals.toFrom) {
            errs.toFrom = "Required";
        }

        if (!vals.account_id) {
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
        if (touched[name === "account_id" ? "account" : name]) {
            const newErrors = validate({ ...values, [name]: value });
            const errorKey = name === "account_id" ? "account" : name;
            setErrors((prev) => ({ ...prev, [errorKey]: newErrors[errorKey] }));
        }
    };

    const handleBlur = (name: keyof FormValues | "account") => () => {
        const touchedKey = name === "account" ? "account" : name;
        setTouched((prev) => ({ ...prev, [touchedKey]: true }));
        const newErrors = validate(values);
        const errorKey = name === "account" || name === "account_id" ? "account" : name;
        setErrors((prev) => ({ ...prev, [errorKey]: newErrors[errorKey] }));
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
        console.log("handleSubmit", values);
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

        // Find account name for display
        const selectedAccount = accounts.find((acc) => acc.id.toString() === values.account_id);

        const transaction: Transaction = {
            account: selectedAccount?.name || "",
            account_id: parseInt(values.account_id, 10),
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
                // onBlur={handleBlur("toFrom")}
                error={touched.toFrom && !!errors.toFrom}
                helperText={touched.toFrom ? errors.toFrom : undefined}
                label="To / From"
                // onFocus={() => accountInputRef.current && accountInputRef.current.focus()}
                ref={toFromInputRef}
            />
            <SelectContainer error={touched.account && !!errors.account}>
                <LabelText error={touched.account && !!errors.account} focused={!!values.account_id || accountFocused}>
                    Account
                </LabelText>
                <SelectElement
                    ref={accountSelectRef}
                    value={values.account_id}
                    onChange={(e) => {
                        setValues((prev) => ({ ...prev, account_id: e.target.value }));
                        if (touched.account) {
                            const newErrors = validate({ ...values, account_id: e.target.value });
                            setErrors((prev) => ({ ...prev, account: newErrors.account }));
                        }
                    }}
                    onFocus={() => {
                        setAccountFocused(true);
                    }}
                    onBlur={() => {
                        setAccountFocused(false);
                        handleBlur("account")();
                    }}
                    error={touched.account && !!errors.account}
                    disabled={isLoadingAccounts}
                >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                    ))}
                </SelectElement>
                <HelpText>{touched.account ? errors.account : undefined}</HelpText>
            </SelectContainer>
            <Input
                name="category"
                value={values.category}
                onChange={handleChange("category")}
                // onBlur={handleBlur("category")}
                error={touched.category && !!errors.category}
                helperText={touched.category ? errors.category : undefined}
                label="Category"
                // onFocus={() => dateInputRef.current && dateInputRef.current.getInput().focus()}
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
                // onBlur={(event: React.FocusEvent<HTMLDivElement>) => {
                //     if (values.date) {
                //         setMonthCode(getMonthCodeFromDate(values.date));
                //     }
                //     handleBlur("date")();
                // }}
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
                // // onBlur={formatMoneyOnBlur("outFlow")}
                error={touched.outFlow && !!errors.outFlow}
                helperText={touched.outFlow ? errors.outFlow : undefined}
                label="Out"
                ref={outInputRef}
            />
            <Input
                name="inFlow"
                value={values.inFlow}
                onChange={handleChange("inFlow")}
                // // onBlur={formatMoneyOnBlur("inFlow")}
                error={touched.inFlow && !!errors.inFlow}
                helperText={touched.inFlow ? errors.inFlow : undefined}
                label="In"
            />
            <Input
                name="note"
                value={values.note}
                onChange={handleChange("note")}
                // onBlur={handleBlur("note")}
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
