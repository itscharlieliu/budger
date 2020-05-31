import styled from "styled-components";

import { UNIT_LENGTH } from "../../defs/theme";

const ListItem = styled.div`
    width: auto;
    height: ${UNIT_LENGTH}px;
    display: flex;
    align-items: center;
    padding: 0 ${UNIT_LENGTH / 4}px;
`;

export default ListItem;
