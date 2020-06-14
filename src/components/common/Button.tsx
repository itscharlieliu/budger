import React from "react";
import styled from "styled-components";

import { theme } from "../../defs/theme";

interface ButtonTextProps {
    hasIcon: boolean;
}

const RaisedButton = styled.button`
    padding: 16px;
    outline: none;
    border: none;
    border-radius: 32px;
    ${theme.shadow.med};
    background-color: ${theme.palette.background.main};
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 16px;
    width: max-content;

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
        transition: box-shadow 0s;
        ${theme.shadow.med};
    }

    transition: box-shadow 0.3s;
`;

const ButtonContent = styled.div<ButtonTextProps>`
    margin-left: ${(props: ButtonTextProps): string => (props.hasIcon ? "16px" : "")};
`;

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    lower?: boolean;
    icon?: JSX.Element;
}

const Button = (props: ButtonProps): JSX.Element => {
    const { children, ...otherProps } = props;
    return (
        <RaisedButton {...otherProps}>
            {props.icon}
            {children && <ButtonContent hasIcon={!!props.icon}>{children}</ButtonContent>}
        </RaisedButton>
    );
};

export default Button;
