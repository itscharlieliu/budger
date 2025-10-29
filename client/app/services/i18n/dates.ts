import moment from "moment";

const date = {
    init(locale: string) {
        if (locale === "en") {
            // moment defaults to "en"
            return;
        }
        return import(`moment/locale/${locale}`);
    },

    format(date: Date, format: string) {
        return moment(date).format(format);
    },
};

export default date;
