import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import hn from '../locales/hn.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en', // default
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      hn: { translation: hn },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
