<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100">{{ t('members.title') }}</h2>
        <p class="text-slate-600 dark:text-slate-400 mt-2">{{ t('members.subtitle') }}</p>
      </div>
      <button
        v-if="isAdmin"
        @click="showAddModal = true"
        class="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        <Icon icon="heroicons:plus" class="w-5 h-5" />
        {{ t('members.addMember') }}
      </button>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('members.searchPlaceholder')"
        class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
      />
    </div>

    <!-- Members Table -->
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">{{ t('members.name') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">{{ t('members.gender') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">{{ t('members.birthYear') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">{{ t('members.status') }}</th>
              <th v-if="isAdmin" class="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">{{ t('members.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-slate-50 dark:hover:bg-slate-800">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                {{ member.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                {{ t(`members.${member.gender}`) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                {{ member.birth_year || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  member.is_deceased 
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' 
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                ]">
                  {{ member.is_deceased ? t('members.deceased') : t('members.living') }}
                </span>
              </td>
              <td v-if="isAdmin" class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex gap-2">
                  <button
                    @click="editMember(member)"
                    class="text-primary hover:text-primary/80"
                    :title="t('common.edit')"
                  >
                    <Icon icon="heroicons:pencil" class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDelete(member)"
                    class="text-red-600 hover:text-red-700"
                    :title="t('common.delete')"
                  >
                    <Icon icon="heroicons:trash" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Member Modal -->
    <div v-if="showAddModal || editingMember" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {{ editingMember ? t('members.editMember') : t('members.addNewMember') }}
        </h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ t('members.nameRequired') }}</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <!-- Gender -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ t('members.genderRequired') }}</label>
              <select
                v-model="formData.gender"
                required
                class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="male">{{ t('members.male') }}</option>
                <option value="female">{{ t('members.female') }}</option>
              </select>
            </div>

            <!-- Birth Year -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ t('members.birthYear') }}</label>
              <input
                v-model.number="formData.birth_year"
                type="number"
                min="1800"
                max="2100"
                class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <!-- Father -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ t('members.father') }}</label>
              <select
                v-model="formData.father_id"
                class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option :value="null">{{ t('common.none') }}</option>
                <option v-for="male in maleMembers" :key="male.id" :value="male.id">
                  {{ male.name }}
                </option>
              </select>
            </div>

            <!-- Mother -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ t('members.mother') }}</label>
              <select
                v-model="formData.mother_id"
                class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option :value="null">{{ t('common.none') }}</option>
                <option v-for="female in femaleMembers" :key="female.id" :value="female.id">
                  {{ female.name }}
                </option>
              </select>
            </div>

            <!-- Married Status -->
            <div class="md:col-span-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.is_married"
                  type="checkbox"
                  class="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ t('members.married') || 'Married' }}</span>
              </label>
            </div>

            <!-- Spouse Selection (if married) -->
            <div v-if="formData.is_married" class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ t('members.spouse') || 'Spouse' }}</label>
              <select
                v-model="formData.spouse_id"
                class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option :value="null">{{ t('common.none') }}</option>
                <option v-for="member in availableSpouses" :key="member.id" :value="member.id">
                  {{ member.name }} ({{ t(`members.${member.gender}`) }})
                </option>
              </select>
            </div>

            <!-- Deceased Status -->
            <div class="md:col-span-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.is_deceased"
                  type="checkbox"
                  class="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ t('members.deceased') }}</span>
              </label>
            </div>

            <!-- Death Year (if deceased) -->
            <div v-if="formData.is_deceased" class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ t('members.deathYear') }}</label>
              <input
                v-model.number="formData.death_year"
                type="number"
                min="1800"
                max="2100"
                class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-3 mt-6">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {{ saving ? t('common.saving') : (editingMember ? t('members.update') : t('common.add')) }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {{ t('common.cancel') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deletingMember" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{{ t('members.deleteTitle') }}</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-4" v-html="t('members.deleteMessage', { name: deletingMember.name })">
        </p>
        <div class="flex gap-3">
          <button
            @click="handleDelete"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {{ t('common.delete') }}
          </button>
          <button
            @click="deletingMember = null"
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
import { getAllMembers, addMember, updateMember, deleteMember } from '../api/memberService'
import { languageState } from '../composables/useLanguage'
import { translate } from '../locales'
import { authState } from '../composables/useAuth'

export default {
  name: 'Members',
  components: {
    Icon
  },
  data() {
    return {
      authState,
      languageState,
      members: [],
      searchQuery: '',
      showAddModal: false,
      editingMember: null,
      deletingMember: null,
      saving: false,
      formData: {
        name: '',
        gender: 'male',
        birth_year: null,
        death_year: null,
        is_deceased: false,
        is_married: false,
        father_id: null,
        mother_id: null,
        spouse_id: null
      }
    }
  },
  computed: {
    isAdmin() {
      return !!this.authState.user
    },
    filteredMembers() {
      if (!this.searchQuery) return this.members
      const query = this.searchQuery.toLowerCase()
      return this.members.filter(m => m.name.toLowerCase().includes(query))
    },
    maleMembers() {
      return this.members.filter(m => m.gender === 'male' && m.id !== this.editingMember?.id)
    },
    femaleMembers() {
      return this.members.filter(m => m.gender === 'female' && m.id !== this.editingMember?.id)
    },
    availableSpouses() {
      // All members except the one being edited
      return this.members.filter(m => m.id !== this.editingMember?.id)
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
        alert(this.t('members.errorLoading'))
      }
    },
    editMember(member) {
      this.editingMember = member
      const spouseId = member.spouse_ids && member.spouse_ids.length > 0 ? member.spouse_ids[0] : null
      this.formData = {
        name: member.name,
        gender: member.gender,
        birth_year: member.birth_year,
        death_year: member.death_year,
        is_deceased: member.is_deceased,
        is_married: !!spouseId,
        father_id: member.father_id,
        mother_id: member.mother_id,
        spouse_id: spouseId
      }
    },
    confirmDelete(member) {
      this.deletingMember = member
    },
    async handleSubmit() {
      this.saving = true
      try {
        // Convert spouse_id to spouse_ids array format for Firestore
        const dataToSave = {
          ...this.formData,
          spouse_ids: this.formData.is_married && this.formData.spouse_id ? [this.formData.spouse_id] : []
        }
        
        delete dataToSave.spouse_id
        delete dataToSave.is_married
        
        if (this.editingMember) {
          // Use docId (Firestore document ID) for updates, not the custom id
          await updateMember(this.editingMember.docId, dataToSave)
          alert(this.t('members.updateSuccess') || 'Member updated successfully!')
        } else {
          const newMemberId = await addMember(dataToSave)
          alert(`${this.t('members.addSuccess') || 'Member added successfully!'} (ID: ${newMemberId})`)
        }
        await this.loadMembers()
        this.closeModal()
      } catch (error) {
        console.error('Error saving member:', error)
        alert(this.t('members.errorSaving'))
      } finally {
        this.saving = false
      }
    },
    async handleDelete() {
      try {
        // Use docId (Firestore document ID) for deletes, not the custom id
        await deleteMember(this.deletingMember.docId)
        await this.loadMembers()
        this.deletingMember = null
      } catch (error) {
        console.error('Error deleting member:', error)
        alert(this.t('members.errorDeleting'))
      }
    },
    closeModal() {
      this.showAddModal = false
      this.editingMember = null
      this.formData = {
        name: '',
        gender: 'male',
        birth_year: null,
        death_year: null,
        is_deceased: false,
        is_married: false,
        father_id: null,
        mother_id: null,
        spouse_id: null
      }
    }
  },
  mounted() {
    this.loadMembers()
  }
}
</script>
