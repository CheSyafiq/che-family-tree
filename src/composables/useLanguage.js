import { reactive } from 'vue'

// Reactive language state
const languageState = reactive({
  currentLang: 'en'
})

/**
 * Set language to a specific value
 * @param {string} lang - Language code ('en' or 'ms')
 */
export function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'ms') {
    console.warn(`Unsupported language: ${lang}. Defaulting to 'en'`)
    lang = 'en'
  }
  
  languageState.currentLang = lang
  localStorage.setItem('language', lang)
}

/**
 * Toggle between English and Malay
 */
export function toggleLanguage() {
  const newLang = languageState.currentLang === 'en' ? 'ms' : 'en'
  setLanguage(newLang)
}

/**
 * Initialize language from localStorage
 * Call this once when the app starts
 */
export function initLanguage() {
  const savedLang = localStorage.getItem('language')
  const browserLang = navigator.language.toLowerCase()
  
  // Check if saved language exists
  if (savedLang && (savedLang === 'en' || savedLang === 'ms')) {
    languageState.currentLang = savedLang
  }
  // Check if browser language is Malay
  else if (browserLang.startsWith('ms') || browserLang.startsWith('my')) {
    languageState.currentLang = 'ms'
  }
  // Default to English
  else {
    languageState.currentLang = 'en'
  }
}

export { languageState }
