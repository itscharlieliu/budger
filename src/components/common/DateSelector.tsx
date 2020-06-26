import React, { useEffect, useRef, useState } from "react";
import "./styles/DateSelector.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DayPickerInputProps } from "react-day-picker";
import styled from "styled-components";
import { ZIndex } from "../../defs/theme";

const DatePickerContainer = styled.div`
    --z-index: ${ZIndex.calendar};
`;

const DateSelector = (props: DayPickerInputProps): JSX.Element => {
    const { onChange, ...otherProps } = props;

    const handleDayChange = (day: Date) => {
        // We need to be able to pass the date to react final form by doing this.
        // TODO possibly move this to the form component?
        // @ts-ignore
        onChange && onChange({ target: { value: day } });
    };

    return (
        <DatePickerContainer>
            <DayPickerInput
                onDayChange={handleDayChange}
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                {...otherProps}
            />
        </DatePickerContainer>
    );
};

export default DateSelector;
