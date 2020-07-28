import React, { forwardRef, Ref } from "react";
import "./styles/DateSelector.css";
import { DayPickerInputProps } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import styled from "styled-components";

import { ZIndex } from "../../defs/theme";
import Input, { InputProps } from "./Input";
import date from "../../services/i18n/dates";
import t, { language } from "../../services/i18n/language";
import moment from "moment";

interface DateSelectorProps extends DayPickerInputProps {
    error?: boolean;
}

const DatePickerContainer = styled.div`
    --z-index: ${ZIndex.calendar};
`;

// eslint-disable-next-line react/display-name
const DateSelector = React.forwardRef(
    (props: DateSelectorProps, ref: Ref<DayPickerInput>): JSX.Element => {
        const { onChange, error, onBlur, ...otherProps } = props;

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
        };

        console.log(error);

        return (
            <DatePickerContainer>
                <DayPickerInput
                    ref={ref}
                    component={forwardRef(function DateInput(inputProps: InputProps, ref: Ref<HTMLInputElement>) {
                        return <Input ref={ref} label={t("date")} error={error} {...inputProps} />;
                    })}
                    onDayChange={handleDayChange}
                    placeholder={""}
                    format={language.locale}
                    formatDate={(date: Date) => t("fullDate", { date })}
                    // TODO Fix date parse
                    parseDate={(dateString: string, format: string) => {
                        const date = moment(dateString, format);
                        if (date.isValid()) {
                            return date.toDate();
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
