import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json'
import vi from './vn.json'
import id from './in.json'
import ru from './ru.json'
import fr from './fr.json'
import ar from './ar.json'
import fa from './fa.json'

const resources = {
  en: {
    translation: en
  },
  vi: {
    translation: vi
  },
  id: {
    translation: id
  },
  ru: {
    translation: ru
  },
  fr: {
    translation: fr
  },
  ar: {
    translation: ar
  },
  fa: {
    translation: fa
  }
}


const localLanguage = localStorage.getItem("language")

i18n.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: resources,
    lng: localLanguage || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  }, () => {})

export default i18n

