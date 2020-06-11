import { SET_TRANSLATION_INITIALIZED, SetTranslationInitializedAction } from "./initializationInterfaces";

export const setLanguageInitialized = (isInitialized: boolean): SetTranslationInitializedAction => ({
    type: SET_TRANSLATION_INITIALIZED,
    translationInitialized: isInitialized,
});
