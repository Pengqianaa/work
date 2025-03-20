import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enUS from './en-US'
import zhCN from './zh-CN'

const savedLanguage = localStorage.getItem('language')

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enUS
      },
      zh: {
        translation: zhCN
      }
    },
    lng: savedLanguage || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
    },
    react: {
      useSuspense: true
    }
  })

export default i18n 