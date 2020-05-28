import styled from "styled-components";
import { theme, UNIT_LENGTH } from "../../defs/theme";

const AppBar = styled.div`
    width: auto;
    height: ${UNIT_LENGTH}px;
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.primary.contrast};
    ${theme.shadow.high};
    display: flex;
    flex-direction: row;
    padding: 0 ${UNIT_LENGTH / 4}px;
    align-items: center;
`;

export default AppBar;
