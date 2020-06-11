import DEV_MODE from "./devMode";

export const SUPPORTED_LOCALES: Record<string, string> = {
    // Based off moment.js locales
    en: "English, United States",
    "fr-ca": "French, Canada",
};

export const FALLBACK_LOCALE = "en";

export const LOCALE_QUERY_PARAM = "locale";

export const I18N_DEFAULT_OPTIONS = {
    locale: "en",
    debug: DEV_MODE,
};
