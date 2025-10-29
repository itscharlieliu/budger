import isPropValid from "@emotion/is-prop-valid";

/**
 * Global shouldForwardProp function using @emotion/is-prop-valid.
 * This automatically filters out non-standard HTML attributes.
 *
 * Used with StyleSheetManager to apply globally to all styled-components.
 *
 * @param propName - The prop name to check
 * @param target - The target element (can be string for HTML elements or React component)
 * @returns true if the prop should be forwarded to the DOM
 */
export const shouldForwardProp = (propName: string, target?: unknown): boolean => {
    // For HTML elements (when target is a string like 'div', 'button', etc.)
    // use isPropValid to check if it's a valid HTML attribute
    if (typeof target === "string") {
        return isPropValid(propName);
    }

    // For React components, forward all props
    return true;
};

// Keep for backward compatibility with components using .withConfig()
export const defaultShouldForwardProp = (prop: string): boolean => {
    return isPropValid(prop);
};
