import en from './en'
import ms from './ms'

// Translation store
const translations = {
  en,
  ms
}

/**
 * Translate a key path to the current language
 * @param {string} lang - Language code ('en' or 'ms')
 * @param {string} key - Dot-notation key path (e.g., 'dashboard.title')
 * @param {Object} params - Optional parameters for string interpolation
 * @returns {string} Translated text or key if not found
 */
export function translate(lang, key, params = {}) {
  // Get the translation object for the language
  const langTranslations = translations[lang] || translations.en
  
  // Split the key by dots and traverse the object
  const keys = key.split('.')
  let result = langTranslations
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      console.warn(`Translation not found: ${lang}.${key}`)
      return key
    }
  }
  
  // If result is not a string, return the key
  if (typeof result !== 'string') {
    console.warn(`Translation is not a string: ${lang}.${key}`)
    return key
  }
  
  // Replace parameters in the string
  // e.g., "Hello {name}" with params { name: "John" } becomes "Hello John"
  let translatedText = result
  for (const [paramKey, paramValue] of Object.entries(params)) {
    translatedText = translatedText.replace(
      new RegExp(`\\{${paramKey}\\}`, 'g'),
      paramValue
    )
  }
  
  return translatedText
}

export { translations }
