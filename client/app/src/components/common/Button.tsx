import React from "react";
import styled from "styled-components";

import { theme } from "../../defs/theme";

interface ButtonTextProps {
    hasIcon: boolean;
}

const FlatButton = styled.button`
    padding: 12px;
    outline: none;
    border: none;
    border-radius: 32px;
    background-color: ${theme.palette.background.main};
    display: flex;
    align-items: center;
    cursor: pointer;
    width: max-content;
    font-size: 1em;

    &:focus-visible {
        ${theme.shadow.med}
    }

    &:focus {
        ${theme.shadow.med}
    }

    &:hover {
        ${theme.shadow.med}
    }

    &:active {
        transition: box-shadow 0s;
        ${theme.shadow.low};
    }

    transition: box-shadow 0.1s ease-in;
`;

const RaisedButton = styled(FlatButton)`
    ${theme.shadow.med};

    &:focus-visible {
        ${theme.shadow.high}
    }

    &:focus {
        ${theme.shadow.high}
    }

    &:hover {
        ${theme.shadow.high}
    }

    &:active {
        ${theme.shadow.med};
    }
`;

const ButtonContent = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== "hasIcon",
})<ButtonTextProps>`
    margin-left: ${(props: ButtonTextProps): string => (props.hasIcon ? "16px" : "")};
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    flat?: boolean;
    icon?: JSX.Element;
    noMargin?: boolean;
}

const Button = (props: ButtonProps): JSX.Element => {
    const { children, ...otherProps } = props;
    if (props.flat) {
        return (
            <FlatButton {...otherProps}>
                {props.icon}
                {children && <ButtonContent hasIcon={!!props.icon}>{children}</ButtonContent>}
            </FlatButton>
        );
    }
    return (
        <RaisedButton {...otherProps}>
            {props.icon}
            {children && <ButtonContent hasIcon={!!props.icon}>{children}</ButtonContent>}
        </RaisedButton>
    );
};

export default Button;
