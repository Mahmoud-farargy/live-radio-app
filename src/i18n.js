import i18n from "i18next";
import backend from "i18next-http-backend";
import languageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEn from "./locales/en/en.json";
import translationEs from "./locales/es/es.json";
import translationFr from "./locales/fr/fr.json";

const resources = {
    en: {
        translation: translationEn
    },
    es: {
        translation: translationEs
    },
    fr: {
        translation : translationFr
    }
}


i18n.use(backend).use(languageDetector).use(initReactI18next).init({
    fallbackLng: "en",
    debug: true,
    lng:"en",
    resources,
    detection: {
        order: ["path","localStorage","cookie","htmlTag","queryString", ],
        cache: ["cookie"]
    },
    interpolation: {
        escapeValue: false
    }
});

export default i18n;