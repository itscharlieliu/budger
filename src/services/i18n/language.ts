import i18next, { StringMap } from "i18next";

import { FALLBACK_LOCALE, SUPPORTED_LOCALES } from "../../defs/i18n";

import date from "./dates";

interface IInitOptions {
    locale: string;
    debug?: boolean;
}

const language = {
    async init(options: IInitOptions): Promise<void> {
        const locale = this.activate(options.locale);

        if (!this.isSupported(locale)) {
            throw new Error(`${locale} locale is not supported`);
        }

        const commonOptions = {
            lng: locale,
            debug: options.debug || false,
        };

        const response = await fetch(`/translations/${locale}.json`);
        const resources = await response.json();
        await date.init(locale);
        const i18nextOpt = {
            ...commonOptions,
            interpolation: {
                format: (value: string | Date, format: string = "") => {
                    if (value instanceof Date) {
                        return date.format(value, format);
                    }
                    return value;
                },
            },
        };
        await i18next.init({ resources: { [locale]: resources }, ...i18nextOpt });
    },

    activate(newLocaleCode: string = i18next.language): string {
        if (newLocaleCode && this.isSupported(newLocaleCode)) {
            i18next.language = newLocaleCode;
        }

        return i18next.language || this.fallback;
    },

    get supported(): string[] {
        return Object.keys(SUPPORTED_LOCALES);
    },

    isSupported(localeCode: string): boolean {
        return !!SUPPORTED_LOCALES[localeCode];
    },

    nameFor(localeCode: string): string {
        return SUPPORTED_LOCALES[localeCode];
    },

    get fallback(): string {
        return FALLBACK_LOCALE;
    },

    t(key: string, options?: IInitOptions | StringMap): string {
        return i18next.t(key, options);
    },

    get locale(): string {
        return i18next.language || this.fallback;
    },

    getTemperature(tempCelsius: number, trailingZeros: number = 1): number {
        const factor = parseFloat(i18next.t("temperature.factor"));
        const offset = parseFloat(i18next.t("temperature.offset"));

        // Truncate number to only 1 (or amount specified) decimal places and then removing unnecessary zeros
        return +(tempCelsius * factor + offset).toFixed(trailingZeros);
    },
};

export default language.t;
export { language };
