import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/src/i18n/locales/en.json";
import es from "@/src/i18n/locales/es.json";

const resources = {
  es: { translation: es },
  en: { translation: en },
} as const;

type SupportedLanguage = keyof typeof resources;

const supportedLanguages: SupportedLanguage[] = ["es", "en"];
const defaultLanguage: SupportedLanguage = "es";

const i18nInitialization = i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

i18nInitialization.catch((error) => {
  console.error("Failed to initialize i18n", error);
});

export { i18nInitialization, resources, supportedLanguages };
export default i18n;
