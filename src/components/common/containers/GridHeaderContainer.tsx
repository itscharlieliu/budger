import styled from "styled-components";

import { theme } from "../../../defs/theme";

const GridHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: ${theme.font.size.big};
    font-weight: ${theme.font.weight.bold};
    padding: 16px;
    border-bottom: 2px solid ${theme.palette.background.contrast};

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

export default GridHeaderContainer;
