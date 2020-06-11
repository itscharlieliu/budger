import DEV_MODE from "./devMode";

export const SUPPORTED_LOCALES: Record<string, string> = {
    "en-US": "English, United States",
    "fr-CA": "French, Canada",
};

export const FALLBACK_LOCALE = "en-US";

export const LOCALE_QUERY_PARAM = "locale";

export const I18N_DEFAULT_OPTIONS = {
    locale: "en-US",
    debug: DEV_MODE,
};
