<template>
  <div class="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8">
        <div class="text-center mb-8">
          <Icon icon="heroicons:user-group" class="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ t('login.title') }}</h1>
          <p class="text-slate-600 dark:text-slate-400 mt-2">{{ t('login.subtitle') }}</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Email Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ t('login.email') }}
            </label>
            <input
              v-model="email"
              type="email"
              required
              :placeholder="t('login.emailPlaceholder')"
              class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <!-- Password Input -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ t('login.password') }}
            </label>
            <input
              v-model="password"
              type="password"
              required
              :placeholder="t('login.passwordPlaceholder')"
              class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Icon v-if="loading" icon="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
            <span>{{ loading ? t('login.signingIn') : t('login.signIn') }}</span>
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>{{ t('login.demoText') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'
import { signIn } from '../composables/useAuth'
import { languageState } from '../composables/useLanguage'
import { translate } from '../locales'

export default {
  name: 'Login',
  components: {
    Icon
  },
  data() {
    return {
      languageState,
      email: '',
      password: '',
      loading: false,
      error: null
    }
  },
  methods: {
    t(key) {
      return translate(this.languageState.currentLang, key)
    },
    async handleSubmit() {
      this.loading = true
      this.error = null

      try {
        await signIn(this.email, this.password)
        this.$router.push('/')
      } catch (error) {
        this.error = this.t('login.errorInvalid')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
