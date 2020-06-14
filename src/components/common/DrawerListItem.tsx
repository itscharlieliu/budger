import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme, UNIT_LENGTH, Z_INDEX_ACTIVE, Z_INDEX_INACTIVE } from "../../defs/theme";

interface ListItemProps {
    isHighlighted?: boolean;
    isButton?: boolean;
    children: ReactNode;
    onClick?: ({ ...any }) => void;
}

interface ListItemContainerProps {
    highlight?: boolean;
}

const ListItemContainer = styled.div<ListItemContainerProps>`
    width: 100%;
    display: flex;
    align-items: center;
    background: ${(props: ListItemContainerProps): string => (props.highlight ? theme.palette.primary.main : "")};
    border-radius: 0 32px 32px 0;
    font-weight: ${(props: ListItemContainerProps): number =>
        props.highlight ? theme.font.weight.bold : theme.font.weight.none};
`;

const ListItemButtonContainer = styled(ListItemContainer)`
    cursor: pointer;
    position: relative;
    z-index: ${Z_INDEX_INACTIVE};

    &:hover {
        ${theme.shadow.med};
        z-index: ${Z_INDEX_ACTIVE};
    }

    &:active {
        transition: box-shadow 0s;
        ${theme.shadow.low};
        z-index: ${Z_INDEX_ACTIVE};
    }

    transition: box-shadow 0.2s;
`;

const ListItemContent = styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${UNIT_LENGTH / 4}px;
`;

const DrawerListItem = (props: ListItemProps): JSX.Element => {
    const { isHighlighted, isButton, onClick, ...otherProps } = props;

    if (isButton) {
        return (
            <ListItemButtonContainer highlight={isHighlighted} onClick={onClick}>
                <ListItemContent {...otherProps} />
            </ListItemButtonContainer>
        );
    }

    return (
        <ListItemContainer highlight={isHighlighted} onClick={onClick}>
            <ListItemContent {...otherProps} />
        </ListItemContainer>
    );
};

export default DrawerListItem;
