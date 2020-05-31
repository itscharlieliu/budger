import styled from "styled-components";
import { theme, UNIT_LENGTH } from "../../defs/theme";

const AppBar = styled.div`
    width: auto;
    height: ${UNIT_LENGTH}px;
    display: flex;
    flex-direction: row;
    padding: 0 ${UNIT_LENGTH / 4}px;
    align-items: center;
    border-bottom: 1px solid ${theme.palette.divider.main};
`;

export default AppBar;
