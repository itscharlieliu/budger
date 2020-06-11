import {
    GenericInitializationAction,
    InitializationState,
    SET_TRANSLATION_INITIALIZED,
} from "./initializationInterfaces";

export const defaultInitializationState: InitializationState = {
    translationInitialized: false,
};

const initializationReducer = (
    state: InitializationState = defaultInitializationState,
    action: GenericInitializationAction,
): InitializationState => {
    switch (action.type) {
        case SET_TRANSLATION_INITIALIZED: {
            return { ...state, translationInitialized: action.translationInitialized };
        }
        default: {
            return { ...state };
        }
    }
};

export default initializationReducer;
