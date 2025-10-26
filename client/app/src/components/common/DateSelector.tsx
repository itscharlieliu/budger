import moment from "moment";
import React, { forwardRef, Ref } from "react";
import "./styles/DateSelector.css";
import { DayPickerInputProps } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import styled from "styled-components";

import { ZIndex } from "../../defs/theme";
import t from "../../services/i18n/language";

import Input, { InputProps } from "./Input";

interface DateSelectorProps extends DayPickerInputProps {
    error?: boolean;
    helperText?: string;
}

const DatePickerContainer = styled.div`
    --z-index: ${ZIndex.calendar};
`;

// eslint-disable-next-line react/display-name
const DateSelector = React.forwardRef(
    (props: DateSelectorProps, ref: Ref<DayPickerInput>): JSX.Element => {
        const { onChange, error, helperText, onBlur, onDayPickerHide, ...otherProps } = props;

        const handleDayChange = (day: Date) => {
            // We need to be able to pass the date to react final form by doing this.
            // TODO possibly move this to the form component?
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onChange && onChange({ target: { value: day } });
        };

        const handleDayPickerHide = () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onBlur && onBlur();
            onDayPickerHide && onDayPickerHide();
        };

        return (
            <DatePickerContainer>
                <DayPickerInput
                    ref={ref}
                    component={forwardRef(function DateInput(inputProps: InputProps, ref: Ref<HTMLInputElement>) {
                        return (
                            <Input ref={ref} label={t("date")} error={error} helperText={helperText} {...inputProps} />
                        );
                    })}
                    onDayChange={handleDayChange}
                    placeholder={""}
                    format={moment.localeData().longDateFormat("L")}
                    formatDate={(date: Date) => t("fullDate", { date })}
                    parseDate={(dateString: string, format: string) => {
                        const newDate = moment(dateString, format, true);
                        if (newDate.isValid()) {
                            return newDate.toDate();
                        }
                    }}
                    onDayPickerHide={handleDayPickerHide}
                    {...otherProps}
                />
            </DatePickerContainer>
        );
    },
);

export default DateSelector;
