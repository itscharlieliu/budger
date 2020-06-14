import styled from "styled-components";
import { theme } from "../../defs/theme";

// TODO Create better animation for input on focus

const Input = styled.input`
    outline: none;
    border-width: 2px;
    border-style: none none solid none;
    border-color: ${theme.palette.input.inactive};
    padding: 8px 0;
    margin: 4px;

    &:focus {
        border-color: ${theme.palette.input.active};
    }

    transition: border-bottom-color 0.3s;
`;

export default Input;
