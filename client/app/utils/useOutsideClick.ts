import { RefObject, useEffect, useRef } from "react";

const useOutsideClick = (ref: RefObject<HTMLElement>, onOutsideClick: () => void, enable?: boolean): void => {
    const isJustEnabled = useRef(false);

    useEffect(() => {
        if (enable === undefined || enable) {
            // Track that the modal was just enabled, so we ignore the first click
            isJustEnabled.current = true;

            const handleClick = (event: MouseEvent) => {
                console.log("handleClick", event);

                if (event.defaultPrevented) {
                    return;
                }

                // Ignore the first click after enabling (likely the click that opened the modal)
                if (isJustEnabled.current) {
                    isJustEnabled.current = false;
                    return;
                }

                if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
                    onOutsideClick();
                }
            };

            document.addEventListener("click", handleClick);
            console.log("added event listener");
            return () => {
                document.removeEventListener("click", handleClick);
                isJustEnabled.current = false;
            };
        }
    }, [ref, enable, onOutsideClick]);
};

export default useOutsideClick;
