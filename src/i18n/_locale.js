import flatten from 'flat'

import en from './en-US'
import zh from './zh-TW'

const getLocaleData = locale => {
  let messages;
  if (locale.includes('zh')) {
    messages = flatten(zh);
  } else {
    messages = flatten(en);
  }
  return messages
}

export default getLocaleData