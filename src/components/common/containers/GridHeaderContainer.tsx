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
`;

export default GridHeaderContainer;
