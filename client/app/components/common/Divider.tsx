import styled from "styled-components";

import { theme } from "../../defs/theme";

const Divider = styled.div`
    height: 0;
    width: auto;
    border-bottom: 1px solid ${theme.palette.divider.main};
`;

export default Divider;
