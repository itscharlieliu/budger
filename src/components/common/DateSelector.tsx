import React, { useEffect, useRef, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import styled from "styled-components";

import "react-calendar/dist/Calendar.css";
import { theme, ZIndex } from "../../defs/theme";

import Input from "./Input";
import useOutsideClick from "../../utils/useOutsideClick";

interface CalendarContainerProps extends CalendarProps {
    onClose: () => void;
    isOpen: boolean;
}

const StyledCalendar = styled(Calendar)`
    position: absolute;
    width: 350px;
    max-width: 100%;
    background: white;
    border: none;
    border-radius: 4px;
    padding: 4px;
    line-height: 1.125em;
    z-index: ${ZIndex.inactive};
    ${theme.shadow.med};

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

const CalendarContainer = (props: CalendarContainerProps): JSX.Element | null => {
    const [isShowing, setIsShowing] = useState<boolean>(false);

    const { isOpen, onClose, ...otherProps } = props;

    const calendarRef = useRef<HTMLDivElement>(null);

    useOutsideClick(calendarRef, onClose ? onClose : () => undefined, isOpen && onClose !== undefined);

    useEffect(() => setIsShowing(isOpen), [isOpen]);

    if (!isShowing) {
        return null;
    }

    return (
        <div ref={calendarRef}>
            <StyledCalendar {...otherProps} />
        </div>
    );
};

const DateSelector = (): JSX.Element => {
    const [isSelectingDate, setIsSelectingDate] = useState(false);

    return (
        <>
            <Input onClick={() => setIsSelectingDate(true)} />
            <CalendarContainer isOpen={isSelectingDate} onClose={() => setIsSelectingDate(false)} />
        </>
    );
};

export default DateSelector;
