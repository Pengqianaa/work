import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enUS from './en-US'
import zhCN from './zh-CN'

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
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n 