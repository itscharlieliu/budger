import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { theme, ZIndex } from "../../defs/theme";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    helperText?: string;
    label?: string;
    width?: number;
    error?: boolean;
}

interface InputContainerProps {
    error?: boolean;
}

interface TextContainerProps {
    error?: boolean;
}

interface LabelTextProps {
    focused: boolean;
    error?: boolean;
}

const InputContainer = styled.div<InputContainerProps>`
    display: flex;
    flex-direction: column;
    margin: 4px;
    color: ${(props: InputContainerProps): string =>
        props.error ? theme.palette.error.main : theme.palette.background.contrast};
`;

const TextContainer = styled.input<TextContainerProps>`
    outline: none;
    font-size: 1em;
    border-width: 2px;
    border-style: none none solid none;
    border-color: ${(props: TextContainerProps): string =>
        props.error ? theme.palette.error.light : theme.palette.input.inactive};
    background-color: #00000000;
    padding: 8px 0;
    z-index: ${ZIndex.input};

    &:focus {
        border-color: ${(props: TextContainerProps): string =>
            props.error ? theme.palette.error.main : theme.palette.input.active};
    }

    transition: border-bottom-color 0.2s;
`;

const LabelText = styled.span<LabelTextProps>`
    display: inline-block;
    overflow: visible;
    height: 1em;
    font-weight: ${theme.font.weight.bold};
    color: ${(props: LabelTextProps): string => {
        if (props.error) {
            return props.focused ? theme.palette.error.main : theme.palette.error.light;
        }
        return props.focused ? theme.palette.input.active : theme.palette.input.inactive;
    }};
    transform-origin: left;
    transform: ${(props: LabelTextProps): string => (props.focused ? "scale(.75)" : "translateY(calc(8px + 1em))")};
    z-index: ${ZIndex.inputLabel};

    transition: transform 0.2s, font-size 0.2s, color 0.2s;
`;

const HelpText = styled.span`
    font-size: 0.75em;
    word-wrap: break-word;
`;

const Input = (props: InputProps): JSX.Element => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const { error, helperText, label, onFocus, onBlur, value, ...otherProps } = props;

    const onInputFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
        onFocus && onFocus(event);
        setIsFocused(true);
    };

    const onInputBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
        onBlur && onBlur(event);
        setIsFocused(false);
    };

    return (
        <InputContainer error={error}>
            <LabelText error={error} focused={!!props.placeholder || !!value || isFocused}>
                {label}
            </LabelText>
            <TextContainer error={error} onFocus={onInputFocus} onBlur={onInputBlur} value={value} {...otherProps} />
            <HelpText>{helperText}</HelpText>
        </InputContainer>
    );
};

export default Input;
