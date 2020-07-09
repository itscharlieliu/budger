import React from "react";
import styled from "styled-components";

import { theme } from "../../defs/theme";

const SWITCH_HEIGHT = "28px";
const SWITCH_WIDTH = "54px";
const THUMB_DIAMETER = "20px";
const SWITCH_RADIUS = "28px";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    label?: string;
    spaced?: boolean;
}

const SwitchContainer = styled.label`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: ${(props: SwitchProps) => (props.spaced ? "space-between" : "unset")};
    width: ${(props: SwitchProps) => (props.spaced ? "unset" : "min-content")};
    margin: 4px;
    cursor: pointer;
`;

const LabelContainer = styled.span`
    color: ${(props: SwitchProps): string =>
        props.error ? theme.palette.error.main : theme.palette.background.contrast};
    margin-right: 8px;
`;

const SliderContainer = styled.div`
    position: relative;
    display: inline-block;
    width: ${SWITCH_WIDTH};
    height: ${SWITCH_HEIGHT};
`;

const SwitchInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
        background-color: ${(props: SwitchProps): string =>
            props.error ? theme.palette.error.light : theme.palette.primary.main};
    }

    &:checked + span:before {
        transform: translateX(26px);
    }

    &:focus-visible + span {
        ${theme.shadow.low}
    }

    &:focus + span {
        ${theme.shadow.low};
    }

    &:hover + span {
        ${theme.shadow.med};
    }
`;

const SwitchSlider = styled.span`
    position: absolute;
    border-radius: ${SWITCH_RADIUS};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${(props: SwitchProps): string =>
        props.error ? theme.palette.error.light : theme.palette.switch.inactive};
    -webkit-transition: 0.4s;
    transition: background-color 0.2s ease, box-shadow 0.1s ease-in;

    &:before {
        border-radius: 50%;
        position: absolute;
        content: "";
        height: ${THUMB_DIAMETER};
        width: ${THUMB_DIAMETER};
        left: 4px;
        bottom: 4px;
        background-color: ${theme.palette.switch.thumb};
        transition: 0.2s cubic-bezier(0, 0.1, 0.3, 0.7);
    }
`;

const Switch = (props: SwitchProps): JSX.Element => {
    const { spaced, error, label, ...otherProps } = props;

    return (
        <SwitchContainer spaced={spaced}>
            {label && <LabelContainer error={error}>{label}</LabelContainer>}
            <SliderContainer>
                <SwitchInput {...otherProps} type={"checkbox"} error={error} />
                <SwitchSlider error={error} />
            </SliderContainer>
        </SwitchContainer>
    );
};

export default Switch;
