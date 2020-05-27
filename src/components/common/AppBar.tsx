import styled from "styled-components";
import { theme } from "../../defs/theme";

const AppBar = styled.div`
    width: ${theme.size.appBar.width};
    height: ${theme.size.appBar.height};
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.primary.contrast};
    box-shadow: ${theme.shadow.high};
    display: flex;
    flex-direction: row;
    padding: 0 16px;
    align-items: center;
`;

export default AppBar;
