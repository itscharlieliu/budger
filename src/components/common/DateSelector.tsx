import React, { useEffect, useRef, useState } from "react";
import Calendar, { CalendarProps, OnChangeDateCallback } from "react-calendar";
import styled from "styled-components";

import "react-calendar/dist/Calendar.css";
import { theme, ZIndex } from "../../defs/theme";
import t from "../../services/i18n/language";
import useOutsideClick from "../../utils/useOutsideClick";

import Input, { InputProps } from "./Input";

interface DateSelectorProps extends Omit<InputProps, "value" | "onChange"> {
    value?: Date;
    onChange?: OnChangeDateCallback;
}

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

    useEffect(() => {
        setIsShowing(isOpen);
    }, [isOpen]);

    if (!isShowing) {
        return null;
    }

    return (
        <div ref={calendarRef}>
            <StyledCalendar {...otherProps} />
        </div>
    );
};

const DateSelector = (props: DateSelectorProps): JSX.Element => {
    const [isSelectingDate, setIsSelectingDate] = useState(false);

    // We need to take out onBlur because the input blurs as soon as the calendar opens
    // eslint-disable-next-line no-unused-vars
    const { value, onChange, onBlur, ...otherProps } = props;

    const handleCalendarClose = () => {
        // @ts-ignore
        onBlur();
        setIsSelectingDate(false);
    };

    return (
        <>
            <Input
                {...otherProps}
                onClick={() => setIsSelectingDate(true)}
                value={value ? t("fullDate", { date: value }) : undefined}
                readOnly
            />
            <CalendarContainer isOpen={isSelectingDate} onClose={handleCalendarClose} onChange={onChange} />
        </>
    );
};

export default DateSelector;
