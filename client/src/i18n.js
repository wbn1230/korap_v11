import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import kor from "./locales/kor.json";

const resources = {
  en: {
    translation: en,
  },
  kor: {
    translation: kor,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "kor",
  fallbacking: "kor",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
