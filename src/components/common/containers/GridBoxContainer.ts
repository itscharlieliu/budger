import styled from "styled-components";

import { theme } from "../../../defs/theme";

const GridBoxContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: ${theme.font.size.small};
    padding: 16px;
    border-top: 1px solid ${theme.palette.divider.main};
    white-space: nowrap;

    & > button {
        opacity: 0;
        transition: opacity 0.2s;
    }

    &:hover > button {
        opacity: 100;
    }

    & > button:focus-visible {
        opacity: 100;
    }

    & > button:active {
        opacity: 100;
    }

    & > button:focus {
        opacity: 100;
    }
`;

export default GridBoxContainer;
