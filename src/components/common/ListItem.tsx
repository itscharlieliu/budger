import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme, UNIT_LENGTH } from "../../defs/theme";

interface ListItemProps {
    isHighlighted?: boolean;
    isButton?: boolean;
    children: ReactNode;
}

interface ListItemContainerProps {
    highlight?: boolean;
}

const ListItemContainer = styled.div<ListItemContainerProps>`
    width: 100%;
    display: flex;
    align-items: center;
    background-color: ${(props: ListItemContainerProps): string => (props.highlight ? theme.palette.primary.main : "")};
    border-radius: 0 32px 32px 0;
`;

const ListItemButtonContainer = styled(ListItemContainer)`
    cursor: pointer;

    &:hover {
        ${theme.shadow.med}
    }

    &:active {
        transition: box-shadow 0s;
        ${theme.shadow.low};
    }

    transition: box-shadow 0.3s;
`;

const ListItemContent = styled.div<ListItemProps>`
    display: flex;
    align-items: center;
    padding: 0 ${UNIT_LENGTH / 4}px;
`;

const ListItem = (props: ListItemProps): JSX.Element => {
    const { isHighlighted, isButton, ...otherProps } = props;

    if (isButton) {
        return (
            <ListItemButtonContainer highlight={isHighlighted}>
                <ListItemContent {...otherProps} />
            </ListItemButtonContainer>
        );
    }

    return (
        <ListItemContainer highlight={isHighlighted}>
            <ListItemContent {...otherProps} />
        </ListItemContainer>
    );
};

export default ListItem;
