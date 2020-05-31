import styled from "styled-components";

import { theme, UNIT_LENGTH } from "../../defs/theme";

const Drawer = styled.div`
    width: ${4 * UNIT_LENGTH}px;
    height: auto;
    background-color: ${theme.palette.background.main};
    border-right: 1px solid ${theme.palette.divider.main};
`;

export default Drawer;
