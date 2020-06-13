import styled from "styled-components";
import { theme } from "../../defs/theme";

const Input = styled.input`
    outline: none;
    border-width: 2px;
    border-style: none none solid none;
    border-color: ${theme.palette.input.inactive};

    &:focus {
        border-color: ${theme.palette.input.active};
    }

    transition: border-bottom-color 0.3s;
`;

export default Input;
