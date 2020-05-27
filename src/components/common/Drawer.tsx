import styled from "styled-components";
import { theme, UNIT_LENGTH } from "../../defs/theme";

const Drawer = styled.div`
    width: ${4 * UNIT_LENGTH}px;
    height: auto;
    background-color: ${theme.palette.secondary.main};
    ${theme.shadow.med};
    z-index: 5;
`;

export default Drawer;
