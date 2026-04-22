import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ka from "./locales/ka.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

const LANGUAGE_KEY = "app_language";

i18n.use(initReactI18next).init({
  resources: {
    ka: { translation: ka },
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: "ka", // default Georgian
  fallbackLng: "ka",
  interpolation: {
    escapeValue: false,
  },
});

// Load saved language on startup
export const loadSavedLanguage = async () => {
  const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (lang) i18n.changeLanguage(lang);
};

// Save language choice
export const setLanguage = async (lang: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

const DATE_LOCALES: Record<string, string> = {
  ka: "ka-GE",
  ru: "ru-RU",
  en: "en-GB",
};

export const getDateLocale = (lang: string): string =>
  DATE_LOCALES[lang] ?? "en-GB";

export default i18n;
