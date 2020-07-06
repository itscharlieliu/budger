import React from "react";
import styled from "styled-components";
import { theme } from "../../defs/theme";

const SWITCH_HEIGHT = "28px";
const SWITCH_WIDTH = "54px";
const THUMB_DIAMETER = "20px";
const SWITCH_RADIUS = "28px";

const SwitchContainer = styled.label`
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
        background-color: ${theme.palette.primary.main};
    }

    &:checked + span:before {
        transform: translateX(26px);
    }

    &:focus-visible + span {
        ${theme.shadow.med}
    }

    &:focus + span {
        ${theme.shadow.med};
    }

    &:hover + span {
        ${theme.shadow.med};
    }
`;

const SwitchSlider = styled.span`
    position: absolute;
    cursor: pointer;
    border-radius: ${SWITCH_RADIUS};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${theme.palette.switch.inactive};
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

const Switch = (props: React.InputHTMLAttributes<HTMLInputElement>): JSX.Element => {
    return (
        <SwitchContainer>
            <SwitchInput {...props} type={"checkbox"} />
            <SwitchSlider />
        </SwitchContainer>
    );
};

export default Switch;
