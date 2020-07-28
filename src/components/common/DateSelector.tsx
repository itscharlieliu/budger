import React from "react";
import "./styles/DateSelector.css";
import { DayPickerInputProps } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import styled from "styled-components";

import { ZIndex } from "../../defs/theme";
import Input from "./Input";
import date from "../../services/i18n/dates";
import t, { language } from "../../services/i18n/language";
import moment from "moment";

interface DateSelectorProps extends DayPickerInputProps {
    error?: boolean;
}

const DatePickerContainer = styled.div`
    --z-index: ${ZIndex.calendar};
`;

const DateSelector = (props: DateSelectorProps): JSX.Element => {
    const { onChange, error, ...otherProps } = props;

    const handleDayChange = (day: Date) => {
        // We need to be able to pass the date to react final form by doing this.
        // TODO possibly move this to the form component?
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange && onChange({ target: { value: day } });
    };

    return (
        <DatePickerContainer>
            <DayPickerInput
                component={Input}
                onDayChange={handleDayChange}
                placeholder={moment.localeData(language.locale).longDateFormat("L")}
                format={language.locale}
                formatDate={(date: Date) => t("fullDate", { date })}
                {...otherProps}
            />
        </DatePickerContainer>
    );
};

export default DateSelector;
