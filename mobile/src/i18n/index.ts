import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import plTranslations from './locales/pl.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  pl: {
    translation: plTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: __DEV__,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Keys to store language in
      lookupLocalStorage: 'habbis-language',
      
      // Don't cache language detection
      caches: ['localStorage'],
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // React configuration
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

export default i18n;
