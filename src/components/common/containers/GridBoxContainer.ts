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
`;

export default GridBoxContainer;
