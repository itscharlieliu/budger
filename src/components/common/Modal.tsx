import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { theme, Z_INDEX_MODAL } from "../../defs/theme";
import useOutsideClick from "../../utils/useOutsideClick";

interface ModalProps {
    visible?: boolean;
    children: ReactNode;
    onClose?: () => void;
}

const ModalBackground = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: ${Z_INDEX_MODAL};
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${theme.palette.modal.background};
`;

const ModalContainer = styled.div`
    background-color: ${theme.palette.background.main};
    ${theme.shadow.med};
    border-radius: 4px;
`;

const Modal = (props: ModalProps): JSX.Element | null => {
    const modalRef = useRef<HTMLDivElement>(null);

    useOutsideClick(
        modalRef,
        props.onClose ? props.onClose : () => undefined,
        props.visible && props.onClose !== undefined,
    );

    if (props.visible !== undefined && !props.visible) {
        return null;
    }
    return (
        <ModalBackground>
            <ModalContainer ref={modalRef}>{props.children}</ModalContainer>
        </ModalBackground>
    );
};

export default Modal;
