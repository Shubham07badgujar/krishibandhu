import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './en.json';
import hi from './hi.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes
    }
  });

export default i18n;
