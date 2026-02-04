import { reactive } from 'vue'

// Reactive dark mode state
const darkModeState = reactive({
  isDark: false
})

/**
 * Toggle dark mode on/off
 */
export function toggleDarkMode() {
  darkModeState.isDark = !darkModeState.isDark
  
  // Update document class
  if (darkModeState.isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // Save to localStorage
  localStorage.setItem('theme', darkModeState.isDark ? 'dark' : 'light')
}

/**
 * Initialize dark mode from localStorage
 * Call this once when the app starts
 */
export function initDarkMode() {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // Use saved preference, or fall back to system preference
  darkModeState.isDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
  
  // Apply initial theme
  if (darkModeState.isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export { darkModeState }
