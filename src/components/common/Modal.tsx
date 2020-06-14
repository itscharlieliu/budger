import React, { ReactNode, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { theme, Z_INDEX_MODAL } from "../../defs/theme";
import useOutsideClick from "../../utils/useOutsideClick";
import useMount from "../../utils/useMount";

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
    top: 0;
    left: 0;
    z-index: ${Z_INDEX_MODAL};
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${theme.palette.modal.background};
    opacity: ${(props: ModalBackgroundProps) => props.opacity};

    transition: opacity 0.2s;
`;

const ModalContainer = styled.div`
    background-color: ${theme.palette.background.main};
    ${theme.shadow.med};
    border-radius: 4px;
`;

const Modal = (props: ModalProps): JSX.Element | null => {
    const [fadedIn, setFadedIn] = useState<boolean>(false);
    const [isShowing, setIsShowing] = useState<boolean>(false);

    const visible = props.visible === undefined ? true : props.visible;

    const modalRef = useRef<HTMLDivElement>(null);

    console.log("rerendered");

    useOutsideClick(
        modalRef,
        props.onClose ? props.onClose : () => undefined,
        props.visible && props.onClose !== undefined,
    );

    // Initialize opacity at 0, so we fade in when user activates component
    useEffect(() => {
        if (visible) {
            const timeout = setTimeout(() => {
                setIsShowing(true);
                setFadedIn(true);
            }, 50);
            return () => clearTimeout(timeout);
        }
        const fadeTimeout = setTimeout(() => setFadedIn(false), 50);
        const showTimeout = setTimeout(() => setIsShowing(false), 200);
        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(showTimeout);
        };
    }, [visible]);

    if (!visible && !isShowing) {
        return null;
    }

    return (
        <ModalBackground opacity={fadedIn ? 1 : 0} onAnimationEnd={() => console.log("test")}>
            <ModalContainer ref={modalRef}>{props.children}</ModalContainer>
        </ModalBackground>
    );
};

export default Modal;
