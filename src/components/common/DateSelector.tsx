import React, { useEffect, useRef, useState } from "react";
import "react-day-picker/lib/style.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DayPickerInputProps } from "react-day-picker";
import styled from "styled-components";
import { ZIndex } from "../../defs/theme";

const StyledDataPickerInput = styled(DayPickerInput)`
    background-color: red;
    .DayPickerInput-Overlay {
        background-color: blue;
        z-index: ${ZIndex.calendar};
    }
`;

const DateSelector = (props: DayPickerInputProps): JSX.Element => {
    return <StyledDataPickerInput placeholder="DD/MM/YYYY" format="DD/MM/YYYY" {...props} />;
};

export default DateSelector;
