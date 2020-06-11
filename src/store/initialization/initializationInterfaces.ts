import { Action } from "redux";

export const SET_TRANSLATION_INITIALIZED = "SET_TRANSLATION_INITIALIZED";

export interface InitializationState {
    translationInitialized: boolean;
}

export interface SetTranslationInitializedAction extends Action<typeof SET_TRANSLATION_INITIALIZED> {
    translationInitialized: boolean;
}

export type GenericInitializationAction = SetTranslationInitializedAction;
