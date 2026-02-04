<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100">{{ t('dashboard.title') }}</h2>
      <p class="text-slate-600 dark:text-slate-400 mt-2">{{ t('dashboard.subtitle') }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('dashboard.totalMembers') }}</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{{ totalMembers }}</p>
          </div>
          <div class="p-3 bg-primary/10 rounded-lg">
            <Icon icon="heroicons:users" class="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('dashboard.livingMembers') }}</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{{ livingMembers }}</p>
          </div>
          <div class="p-3 bg-accent/10 rounded-lg">
            <Icon icon="heroicons:heart" class="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('dashboard.generations') }}</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{{ generations }}</p>
          </div>
          <div class="p-3 bg-secondary/10 rounded-lg">
            <Icon icon="heroicons:square-3-stack-3d" class="w-8 h-8 text-secondary" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('dashboard.totalDeceasedMembers') }}</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{{ deceasedMembers }}</p>
          </div>
          <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Icon icon="heroicons:x-circle" class="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-800">
      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{{ t('dashboard.quickActions') }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-if="isAdmin"
          @click="$router.push('/members')"
          class="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Icon icon="heroicons:user-plus" class="w-6 h-6 text-primary" />
          <span class="font-medium text-slate-700 dark:text-slate-300">{{ t('dashboard.addMember') }}</span>
        </button>

        <button
          @click="$router.push('/tree')"
          class="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Icon icon="heroicons:square-3-stack-3d" class="w-6 h-6 text-primary" />
          <span class="font-medium text-slate-700 dark:text-slate-300">{{ t('dashboard.viewTree') }}</span>
        </button>

        <button
          v-if="isAdmin"
          @click="showImportModal = true"
          class="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Icon icon="heroicons:arrow-down-tray" class="w-6 h-6 text-primary" />
          <span class="font-medium text-slate-700 dark:text-slate-300">{{ t('dashboard.importData') }}</span>
        </button>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{{ t('dashboard.importTitle') }}</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          {{ t('dashboard.importMessage') }}
        </p>
        <div class="flex gap-3">
          <button
            @click="handleImport"
            :disabled="importing"
            class="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {{ importing ? t('dashboard.importing') : t('dashboard.import') }}
          </button>
          <button
            @click="showImportModal = false"
            class="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'
import { getAllMembers, importFamilyData, getGenerationLevel } from '../api/memberService'
import { languageState } from '../composables/useLanguage'
import { translate } from '../locales'
import { authState } from '../composables/useAuth'

export default {
  name: 'Dashboard',
  components: {
    Icon
  },
  data() {
    return {
      authState,
      languageState,
      members: [],
      showImportModal: false,
      importing: false
    }
  },
  computed: {
    isAdmin() {
      return !!this.authState.user
    },
    totalMembers() {
      return this.members.length
    },
    livingMembers() {
      return this.members.filter(m => !m.is_deceased).length
    },
    deceasedMembers() {
      return this.members.filter(m => m.is_deceased).length
    },
    generations() {
      if (this.members.length === 0) return 0
      const levels = this.members.map(m => getGenerationLevel(m, this.members))
      return Math.max(...levels) + 1
    }
  },
  methods: {
    t(key, params) {
      return translate(this.languageState.currentLang, key, params)
    },
    async loadMembers() {
      try {
        this.members = await getAllMembers()
      } catch (error) {
        console.error('Error loading members:', error)
      }
    },
    async handleImport() {
      this.importing = true
      try {
        // Import from the JSON file in the project
        const response = await fetch('/family-structure.json')
        const familyData = await response.json()
        
        const count = await importFamilyData(familyData)
        alert(this.t('dashboard.importSuccess', { count }))
        
        // Reload members
        await this.loadMembers()
        this.showImportModal = false
      } catch (error) {
        console.error('Error importing data:', error)
        alert(this.t('dashboard.importError'))
      } finally {
        this.importing = false
      }
    }
  },
  mounted() {
    this.loadMembers()
  }
}
</script>
