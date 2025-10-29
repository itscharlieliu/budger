import styled from "styled-components";

import { theme, UNIT_LENGTH } from "../../defs/theme";

const Drawer = styled.div`
    display: flex;
    flex-direction: column;
    width: ${4 * UNIT_LENGTH}px;
    height: auto;
    background-color: ${theme.palette.background.main};
`;

export default Drawer;
