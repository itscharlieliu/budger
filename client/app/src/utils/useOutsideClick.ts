import { RefObject, useEffect } from "react";

const useOutsideClick = (ref: RefObject<HTMLElement>, onOutsideClick: () => void, enable?: boolean): void => {
    useEffect(() => {
        if (enable === undefined || enable) {
            const handleClick = (event: MouseEvent) => {
                if (event.defaultPrevented) {
                    return;
                }
                if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
                    onOutsideClick();
                }
            };
            document.addEventListener("click", handleClick, false);
            return () => document.removeEventListener("click", handleClick, false);
        }
    }, [ref, enable, onOutsideClick]);
};

export default useOutsideClick;
