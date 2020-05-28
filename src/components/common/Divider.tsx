import styled from "styled-components";
import { colors } from "../../defs/theme";

const Divider = styled.div`
    height: 0;
    width: auto;
    border-bottom: 1px solid ${colors.divider};
`;

export default Divider;
