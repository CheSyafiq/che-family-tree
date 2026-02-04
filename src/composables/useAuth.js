import { reactive } from 'vue'
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../firebase'

// Reactive authentication state
const authState = reactive({
  user: null,
  loading: true,
  error: null
})

/**
 * Sign in with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User object
 */
export async function signIn(email, password) {
  try {
    authState.error = null
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    authState.user = userCredential.user
    return userCredential.user
  } catch (error) {
    authState.error = error.message
    console.error('Sign in error:', error)
    throw error
  }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth)
    authState.user = null
    authState.error = null
  } catch (error) {
    authState.error = error.message
    console.error('Sign out error:', error)
    throw error
  }
}

/**
 * Initialize auth state listener
 * This should be called once when the app starts
 * @returns {Promise<void>} Promise that resolves when initial auth state is loaded
 */
export function initAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      authState.user = user
      authState.loading = false
      resolve()
    })
  })
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!authState.user
}

/**
 * Check if user is admin (authenticated)
 * @returns {boolean}
 */
export function isAdmin() {
  return !!authState.user
}

export { authState }
