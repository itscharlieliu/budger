import React from "react";
import styled from "styled-components";

import { theme } from "../../defs/theme";

const RaisedButton = styled.a`
    padding: 16px 32px;
    outline: none;
    border: none;
    border-radius: 32px;
    ${theme.shadow.med};
    background-color: ${theme.palette.background.main};
    display: inline-block;
    cursor: pointer;

    &:hover {
        ${theme.shadow.high}
    }

    &:active {
        transition: box-shadow 0s;
        ${theme.shadow.med};
    }

    transition: box-shadow 0.3s;
`;

interface ButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
    lower?: boolean;
}

const Button = (props: ButtonProps): JSX.Element => {
    return <RaisedButton {...props} />;
};

export default Button;
