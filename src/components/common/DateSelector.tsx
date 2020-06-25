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
    return (
        <DatePickerContainer>
            <DayPickerInput placeholder="DD/MM/YYYY" format="DD/MM/YYYY" {...props} />
        </DatePickerContainer>
    );
};

export default DateSelector;
