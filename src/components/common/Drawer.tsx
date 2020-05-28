import styled from "styled-components";
import { colors, theme, UNIT_LENGTH } from "../../defs/theme";

const Drawer = styled.div`
    width: ${4 * UNIT_LENGTH}px;
    height: auto;
    background-color: ${colors.white};
    ${theme.shadow.med};
    z-index: 5;
`;

export default Drawer;
