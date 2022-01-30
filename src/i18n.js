import i18n from "i18next";
import backend from "i18next-http-backend";
import languageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { translationEn, translationEs, translationFr, translationCn, translationIt, translationDe, translationHi }from "./locales";

const resources = {
    en: {
        translation: translationEn
    },
    es: {
        translation: translationEs
    },
    fr: {
        translation: translationFr
    },
    hi: {
        translation: translationHi
    },
    cn: {
        translation: translationCn
    },
    it: {
        translation: translationIt
    },
    de: {
        translation: translationDe
    }
}


i18n.use(backend).use(languageDetector).use(initReactI18next).init({
    fallbackLng: "en",
    debug: true,
    lng:"en",
    resources,
    detection: {
        order: ["path", "localStorage", "cookie", "queryString", "htmlTag"],
        cache: ["cookie"]
    },
    interpolation: {
        escapeValue: false
    }
});

export default i18n;