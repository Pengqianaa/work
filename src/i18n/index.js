import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhTW from './locales/zh-TW';
import enUS from './locales/en-US';

const resources = {
  'zh-TW': {
    translation: zhTW,
  },
  'en-US': {
    translation: enUS,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-TW', // 默认语言
    fallbackLng: 'en-US', // 回退语言
    interpolation: {
      escapeValue: false, // React已经安全地转义
    },
  });

export default i18n; 