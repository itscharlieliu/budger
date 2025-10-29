import React, { ReactNode, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { theme, ZIndex } from "../../defs/theme";
import useOutsideClick from "../../utils/useOutsideClick";

const FADE_DURATION_MS = 100;

interface ModalProps {
    visible?: boolean;
    children: ReactNode;
    onClose?: () => void;
}

interface ModalBackgroundProps {
    opacity: number;
}

const ModalBackground = styled.div<ModalBackgroundProps>`
    width: 100vw;
    height: 100vh;
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    z-index: ${ZIndex.modal};
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${theme.palette.modal.background};
    opacity: ${(props: ModalBackgroundProps) => props.opacity};
    transition: opacity ${FADE_DURATION_MS / 1000}s;
`;

const ModalContainer = styled.div`
    background-color: ${theme.palette.background.main};
    ${theme.shadow.med};
    border-radius: 4px;
    max-width: 90vw;
    max-height: 90vh;
    height: max-content;
    overflow: auto;
`;

const Modal = (props: ModalProps): JSX.Element | null => {
    // const [isShowing, setIsShowing] = useState<boolean>(false);

    const visible = props.visible === undefined ? true : props.visible;

    const modalRef = useRef<HTMLDivElement>(null);

    useOutsideClick(
        modalRef,
        props.onClose ? props.onClose : () => undefined,
        props.visible && props.onClose !== undefined,
    );

    if (!visible) {
        return null;
    }

    return (
        <ModalBackground opacity={visible ? 1 : 0}>
            <ModalContainer ref={modalRef}>{props.children}</ModalContainer>
        </ModalBackground>
    );
};

export default Modal;
