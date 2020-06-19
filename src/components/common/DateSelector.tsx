import React from "react";
import Calendar, { CalendarProps } from "react-calendar";
import styled from "styled-components";

import "react-calendar/dist/Calendar.css";
import { theme, ZIndex } from "../../defs/theme";

import Input from "./Input";

const StyledCalendar = styled(Calendar)`
    width: 350px;
    max-width: 100%;
    background: white;
    border: none;
    line-height: 1.125em;
    z-index: ${ZIndex.inactive};

    button {
        border-radius: 32px;
    }

    button:enabled:hover {
        color: ${theme.palette.background.contrast};
        background-color: unset;
        ${theme.shadow.low};
        z-index: ${ZIndex.active};
    }

    button:enabled:active {
        color: ${theme.palette.background.contrast};
        background-color: unset;
        ${theme.shadow.none};
        z-index: ${ZIndex.active};
    }

    button:enabled:focus {
        background-color: unset;
    }

    .react-calendar__tile--now {
        background: ${theme.palette.secondary.main};
        color: ${theme.palette.secondary.contrast};
    }

    .react-calendar__tile--now:enabled:hover,
    .react-calendar__tile--now:enabled:focus {
        background: ${theme.palette.secondary.main};
        color: ${theme.palette.secondary.contrast};
    }

    .react-calendar__month-view__days__day--weekend {
        color: unset;
    }

    .react-calendar__month-view__days__day--neighboringMonth {
        color: #757575;
    }

    .react-calendar__tile--active {
        background: unset;
        color: unset;
    }

    .react-calendar__tile--hasActive,
    .react-calendar__tile--active:enabled:focus {
        background: ${theme.palette.primary.main};
        color: ${theme.palette.primary.contrast};
    }
`;

const DateSelector = (props: CalendarProps) => {
    return (
        <>
            <Input />
            <StyledCalendar />
        </>
    );
};

export default DateSelector;
