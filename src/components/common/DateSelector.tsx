import React, { useEffect, useRef, useState } from "react";
import "react-day-picker/lib/style.css";
import DayPickerInput from "react-day-picker/DayPickerInput";

const DateSelector = (): JSX.Element => {
    return <DayPickerInput placeholder="DD/MM/YYYY" format="DD/MM/YYYY" />;
};

export default DateSelector;
