<template>
  <div class="family-tree-view p-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100">{{ t('sidebar.familyTree') }}</h2>
      <p class="text-slate-600 dark:text-slate-400 mt-2">{{ t('tree.subtitle') }}</p>
    </div>

    <!-- Controls -->
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800 p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="loadFamilyTree"
            :disabled="loading"
            class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Icon icon="heroicons:arrow-path" :class="{ 'animate-spin': loading }" class="w-5 h-5" />
            {{ loading ? t('common.loading') : t('tree.reloadTree') }}
          </button>
          
          <div class="flex items-center gap-2">
            <button
              @click="zoomIn"
              class="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              :title="t('tree.zoomIn')"
            >
              <Icon icon="heroicons:plus" class="w-5 h-5" />
            </button>
            <button
              @click="zoomOut"
              class="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              :title="t('tree.zoomOut')"
            >
              <Icon icon="heroicons:minus" class="w-5 h-5" />
            </button>
            <button
              @click="resetView"
              class="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              :title="t('tree.resetView')"
            >
              <Icon icon="heroicons:arrows-pointing-out" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="flex items-center gap-4 text-sm">
          <span class="text-slate-600 dark:text-slate-400">{{ t('dashboard.totalMembers') }}: <strong class="text-slate-900 dark:text-slate-100">{{ members.length }}</strong></span>
          <span class="text-slate-600 dark:text-slate-400">{{ t('members.living') }}: <strong class="text-green-600 dark:text-green-400">{{ livingCount }}</strong></span>
          <span class="text-slate-600 dark:text-slate-400">{{ t('members.deceased') }}: <strong class="text-slate-600 dark:text-slate-400">{{ deceasedCount }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Icon icon="heroicons:arrow-path" class="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p class="text-slate-600 dark:text-slate-400">{{ t('tree.loadingTree') }}</p>
      </div>
    </div>

    <!-- Tree Container -->
    <div v-else-if="members.length > 0" class="bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div ref="treeContainer" class="w-full" style="min-height: 700px; height: 700px; position: relative;"></div>

      <!-- Legend -->
      <div class="p-6 border-t border-slate-200 dark:border-slate-700">
        <h4 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">{{ t('tree.legend') }}</h4>
        <div class="flex flex-wrap gap-6 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded border-2 border-blue-500 bg-blue-50"></div>
            <span class="text-slate-700 dark:text-slate-300">{{ t('members.male') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded border-2 border-pink-500 bg-pink-50"></div>
            <span class="text-slate-700 dark:text-slate-300">{{ t('members.female') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded border-2 border-dashed border-slate-400 bg-slate-100 opacity-70"></div>
            <span class="text-slate-700 dark:text-slate-300">{{ t('members.deceased') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-0.5 bg-blue-500"></div>
            <span class="text-slate-700 dark:text-slate-300">{{ t('tree.parentChild') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-0.5 bg-red-500"></div>
            <span class="text-slate-700 dark:text-slate-300">{{ t('members.spouse') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-slate-900 rounded-lg shadow p-12 text-center border border-slate-200 dark:border-slate-800">
      <Icon icon="heroicons:users" class="w-16 h-16 mx-auto text-slate-400 mb-4" />
      <h3 class="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">{{ t('tree.noMembers') }}</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-6">{{ t('tree.noMembersMessage') }}</p>
      <button
        @click="loadFamilyTree"
        class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
      >
        {{ t('tree.tryAgain') }}
      </button>
    </div>

    <!-- Couple Details Modal -->
    <transition name="modal">
      <div v-if="selectedCouple" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="selectedCouple = null">
        <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6">
            <div class="flex justify-between items-start">
              <div class="flex-1 pr-4">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100 break-words">👨{{ selectedCouple.person1.name }} 💚 {{ selectedCouple.person2.name }} 👩</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('tree.marriedCouple') }}</p>
              </div>
              <button
                @click="selectedCouple = null"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <Icon icon="heroicons:x-mark" class="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Person 1 -->
              <div class="space-y-4 border-r border-slate-200 dark:border-slate-700 pr-6">
                <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-start gap-2">
                  <Icon 
                    :icon="selectedCouple.person1.gender === 'male' ? 'heroicons:user' : 'heroicons:user-circle'"
                    :class="selectedCouple.person1.gender === 'male' ? 'text-blue-500' : 'text-pink-500'"
                    class="w-6 h-6 flex-shrink-0 mt-0.5"
                  />
                  <span class="break-words">{{ selectedCouple.person1.name }}</span>
                </h4>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Icon icon="heroicons:user" class="w-5 h-5 text-slate-400" />
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('members.gender') }}</p>
                      <p class="font-medium text-slate-900 dark:text-slate-100 capitalize">{{ t(`members.${selectedCouple.person1.gender}`) }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Icon icon="heroicons:heart" class="w-5 h-5 text-slate-400" />
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('members.status') }}</p>
                      <p :class="[
                        'font-medium',
                        selectedCouple.person1.is_deceased 
                          ? 'text-slate-600 dark:text-slate-400' 
                          : 'text-green-600 dark:text-green-400'
                      ]">
                        {{ selectedCouple.person1.is_deceased ? t('members.deceased') : t('members.living') }}
                      </p>
                    </div>
                  </div>

                  <div v-if="selectedCouple.person1.birth_year" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Icon icon="heroicons:cake" class="w-5 h-5 text-slate-400" />
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('tree.born') }}</p>
                      <p class="font-medium text-slate-900 dark:text-slate-100">{{ selectedCouple.person1.birth_year }}</p>
                    </div>
                  </div>

                  <div v-if="selectedCouple.person1.is_deceased && selectedCouple.person1.death_year" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Icon icon="heroicons:calendar" class="w-5 h-5 text-slate-400" />
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('tree.died') }}</p>
                      <p class="font-medium text-slate-900 dark:text-slate-100">{{ selectedCouple.person1.death_year }}</p>
                    </div>
                  </div>
                </div>
                
                <div v-if="selectedCouple.person1.birth_year" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p class="text-sm text-blue-900 dark:text-blue-300">
                    <Icon icon="heroicons:clock" class="w-4 h-4 inline mr-1" />
                    {{ getAge(selectedCouple.person1) }}
                  </p>
                </div>
              </div>
              
              <!-- Person 2 -->
              <div class="space-y-4 pl-6">
                <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-start gap-2">
                  <Icon 
                    :icon="selectedCouple.person2.gender === 'male' ? 'heroicons:user' : 'heroicons:user-circle'"
                    :class="selectedCouple.person2.gender === 'male' ? 'text-blue-500' : 'text-pink-500'"
                    class="w-6 h-6 flex-shrink-0 mt-0.5"
                  />
                  <span class="break-words">{{ selectedCouple.person2.name }}</span>
                </h4>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Icon icon="heroicons:user" class="w-5 h-5 text-slate-400" />
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('members.gender') }}</p>
                      <p class="font-medium text-slate-900 dark:text-slate-100 capitalize">{{ t(`members.${selectedCouple.person2.gender}`) }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Icon icon="heroicons:heart" class="w-5 h-5 text-slate-400" />
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('members.status') }}</p>
                      <p :class="[
                        'font-medium',
                        selectedCouple.person2.is_deceased 
                          ? 'text-slate-600 dark:text-slate-400' 
                          : 'text-green-600 dark:text-green-400'
                      ]">
                        {{ selectedCouple.person2.is_deceased ? t('members.deceased') : t('members.living') }}
                      </p>
                    </div>
                  </div>

                  <div v-if="selectedCouple.person2.birth_year" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Icon icon="heroicons:cake" class="w-5 h-5 text-slate-400" />
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('tree.born') }}</p>
                      <p class="font-medium text-slate-900 dark:text-slate-100">{{ selectedCouple.person2.birth_year }}</p>
                    </div>
                  </div>

                  <div v-if="selectedCouple.person2.is_deceased && selectedCouple.person2.death_year" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Icon icon="heroicons:calendar" class="w-5 h-5 text-slate-400" />
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('tree.died') }}</p>
                      <p class="font-medium text-slate-900 dark:text-slate-100">{{ selectedCouple.person2.death_year }}</p>
                    </div>
                  </div>
                </div>
                
                <div v-if="selectedCouple.person2.birth_year" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p class="text-sm text-blue-900 dark:text-blue-300">
                    <Icon icon="heroicons:clock" class="w-4 h-4 inline mr-1" />
                    {{ getAge(selectedCouple.person2) }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Children Section -->
            <div v-if="getChildren(selectedCouple.person1).length > 0" class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h4 class="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                <Icon icon="heroicons:user-group" class="w-5 h-5 text-slate-400" />
                {{ t('tree.theirChildren', { count: getChildren(selectedCouple.person1).length }) }}
              </h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div
                  v-for="child in getChildren(selectedCouple.person1)"
                  :key="child.id"
                  class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  @click="selectedCouple = null; selectedMember = child"
                >
                  <div class="flex items-center gap-2">
                    <Icon 
                      :icon="child.gender === 'male' ? 'heroicons:user' : 'heroicons:user-circle'"
                      :class="child.gender === 'male' ? 'text-blue-400' : 'text-pink-400'"
                      class="w-5 h-5"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{{ child.name }}</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ child.birth_year || 'Unknown' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Member Details Modal -->
    <transition name="modal">
      <div v-if="selectedMember" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="selectedMember = null">
        <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ selectedMember.name }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('tree.memberId') }}: {{ selectedMember.id }}</p>
              </div>
              <button
                @click="selectedMember = null"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <Icon icon="heroicons:x-mark" class="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Basic Info -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Icon :icon="selectedMember.gender === 'male' ? 'heroicons:user' : 'heroicons:user-circle'" class="w-5 h-5 text-slate-400" />
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('members.gender') }}</p>
                  <p class="font-medium text-slate-900 dark:text-slate-100 capitalize">{{ t(`members.${selectedMember.gender}`) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Icon icon="heroicons:heart" class="w-5 h-5 text-slate-400" />
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('members.status') }}</p>
                  <p :class="[
                    'font-medium',
                    selectedMember.is_deceased 
                      ? 'text-slate-600 dark:text-slate-400' 
                      : 'text-green-600 dark:text-green-400'
                  ]">
                    {{ selectedMember.is_deceased ? t('members.deceased') : t('members.living') }}
                  </p>
                </div>
              </div>

              <div v-if="selectedMember.birth_year" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Icon icon="heroicons:cake" class="w-5 h-5 text-slate-400" />
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('tree.born') }}</p>
                  <p class="font-medium text-slate-900 dark:text-slate-100">{{ selectedMember.birth_year }}</p>
                </div>
              </div>

              <div v-if="selectedMember.is_deceased && selectedMember.death_year" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Icon icon="heroicons:calendar" class="w-5 h-5 text-slate-400" />
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('tree.died') }}</p>
                  <p class="font-medium text-slate-900 dark:text-slate-100">{{ selectedMember.death_year }}</p>
                </div>
              </div>
            </div>

            <!-- Age calculation -->
            <div v-if="selectedMember.birth_year" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p class="text-sm text-blue-900 dark:text-blue-300">
                <Icon icon="heroicons:clock" class="w-4 h-4 inline mr-1" />
                {{ getAge(selectedMember) }}
              </p>
            </div>

            <!-- Parents -->
            <div v-if="getParents(selectedMember).length > 0" class="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 class="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                <Icon icon="heroicons:users" class="w-5 h-5 text-slate-400" />
                {{ t('tree.parents') }}
              </h4>
              <div class="space-y-2">
                <div
                  v-for="parent in getParents(selectedMember)"
                  :key="parent.id"
                  class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  @click="selectedMember = parent"
                >
                  <div class="flex items-center gap-3">
                    <Icon 
                      :icon="parent.gender === 'male' ? 'heroicons:user' : 'heroicons:user-circle'" 
                      :class="parent.gender === 'male' ? 'text-blue-500' : 'text-pink-500'"
                      class="w-5 h-5"
                    />
                    <span class="text-slate-900 dark:text-slate-100">{{ parent.name }}</span>
                  </div>
                  <Icon icon="heroicons:chevron-right" class="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <!-- Spouses -->
            <div v-if="getSpouses(selectedMember).length > 0" class="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 class="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                <Icon icon="heroicons:heart" class="w-5 h-5 text-red-400" />
                {{ getSpouses(selectedMember).length > 1 ? t('tree.spouses') : t('members.spouse') }}
              </h4>
              <div class="space-y-2">
                <div
                  v-for="spouse in getSpouses(selectedMember)"
                  :key="spouse.id"
                  class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  @click="selectedMember = spouse"
                >
                  <div class="flex items-center gap-3">
                    <Icon 
                      :icon="spouse.gender === 'male' ? 'heroicons:user' : 'heroicons:user-circle'" 
                      :class="spouse.gender === 'male' ? 'text-blue-500' : 'text-pink-500'"
                      class="w-5 h-5"
                    />
                    <span class="text-slate-900 dark:text-slate-100">{{ spouse.name }}</span>
                  </div>
                  <Icon icon="heroicons:chevron-right" class="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <!-- Children -->
            <div v-if="getChildren(selectedMember).length > 0" class="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 class="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                <Icon icon="heroicons:user-group" class="w-5 h-5 text-slate-400" />
                {{ t('tree.children') }} ({{ getChildren(selectedMember).length }})
              </h4>
              <div class="space-y-2">
                <div
                  v-for="child in getChildren(selectedMember)"
                  :key="child.id"
                  class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  @click="selectedMember = child"
                >
                  <div class="flex items-center gap-3">
                    <Icon 
                      :icon="child.gender === 'male' ? 'heroicons:user' : 'heroicons:user-circle'" 
                      :class="child.gender === 'male' ? 'text-blue-500' : 'text-pink-500'"
                      class="w-5 h-5"
                    />
                    <div>
                      <span class="text-slate-900 dark:text-slate-100">{{ child.name }}</span>
                      <span v-if="child.birth_year" class="text-xs text-slate-500 dark:text-slate-400 ml-2">({{ child.birth_year }})</span>
                    </div>
                  </div>
                  <Icon icon="heroicons:chevron-right" class="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'
import OrgChart from '@balkangraph/orgchart.js'
import { getAllMembers } from '../api/memberService'
import { languageState } from '../composables/useLanguage'
import { translate } from '../locales'

export default {
  name: 'FamilyTreeView',
  components: {
    Icon
  },
  data() {
    return {
      languageState,
      members: [],
      loading: false,
      selectedMember: null,
      selectedCouple: null,
      chart: null,
      selectedCoupleId: null // From route query
    }
  },
  computed: {
    livingCount() {
      return this.members.filter(m => !m.is_deceased).length
    },
    deceasedCount() {
      return this.members.filter(m => m.is_deceased).length
    }
  },
  methods: {
    t(key, params) {
      return translate(this.languageState.currentLang, key, params)
    },
    async loadFamilyTree() {
      this.loading = true
      try {
        // Get couple filter from route query
        this.selectedCoupleId = this.$route.query.couple || null
        
        const data = await getAllMembers()
        
        // Filter members if a couple is selected
        if (this.selectedCoupleId) {
          this.members = this.filterMembersByCouple(data, this.selectedCoupleId)
        } else {
          this.members = data
        }
        
        console.log('Loaded members:', this.members)
        console.log('Loaded members from Firestore:', this.members.length)
        
        // Wait for loading to finish and DOM to update
        this.loading = false
        
        // Wait for next tick to ensure DOM is rendered with the tree container
        await this.$nextTick()
        await this.$nextTick() // Double nextTick to ensure v-else-if renders
        
        this.renderTree()
      } catch (error) {
        console.error('Error loading family tree:', error)
        alert('Failed to load family tree data from Firestore. Please check your Firebase configuration.')
        this.loading = false
      }
    },

    filterMembersByCouple(allMembers, coupleId) {
      // Parse couple ID (e.g., "M1-M2")
      const [person1Id, person2Id] = coupleId.split('-')
      
      // Find the couple members
      const person1 = allMembers.find(m => m.id === person1Id)
      const person2 = allMembers.find(m => m.id === person2Id)
      
      if (!person1 || !person2) return allMembers
      
      const familyMemberIds = new Set([person1Id, person2Id])
      
      // Add all children (direct descendants)
      const addDescendants = (parentId) => {
        const children = allMembers.filter(m => 
          m.father_id === parentId || m.mother_id === parentId
        )
        children.forEach(child => {
          if (!familyMemberIds.has(child.id)) {
            familyMemberIds.add(child.id)
            // Add child's spouse
            if (child.spouse_ids && child.spouse_ids.length > 0) {
              child.spouse_ids.forEach(spouseId => {
                familyMemberIds.add(spouseId)
              })
            }
            // Recursively add descendants
            addDescendants(child.id)
          }
        })
      }
      
      // Start from both couple members
      addDescendants(person1Id)
      addDescendants(person2Id)
      
      // Filter members to only include family members
      return allMembers.filter(m => familyMemberIds.has(m.id))
    },

    transformToOrgChartData() {
      const nodes = []
      const processedSpouses = new Set()
      const coupleMap = new Map() // Map to track couple node IDs
      
      // Sort members by birth year to ensure correct sibling order
      const sortedMembers = [...this.members].sort((a, b) => {
        const yearA = a.birth_year || 9999
        const yearB = b.birth_year || 9999
        return yearA - yearB
      })
      
      // First pass: Create couple nodes and map individual IDs to couple IDs
      sortedMembers.forEach(member => {
        if (processedSpouses.has(member.id)) return
        
        const hasSpouse = member.spouse_ids && member.spouse_ids.length > 0
        
        if (hasSpouse) {
          const spouseId = member.spouse_ids[0]
          const spouse = sortedMembers.find(m => m.id === spouseId)
          
          if (spouse) {
            processedSpouses.add(member.id)
            processedSpouses.add(spouseId)
            
            // Determine order (male first)
            const person1 = member.gender === 'male' ? member : spouse
            const person2 = member.gender === 'male' ? spouse : member
            
            const coupleId = `${person1.id}-${person2.id}`
            
            // Map both individual IDs to the couple ID
            coupleMap.set(person1.id, coupleId)
            coupleMap.set(person2.id, coupleId)
            
            const node = {
              id: coupleId,
              name: `👨${person1.name}💚${person2.name}👩`,
              person1: person1,
              person2: person2,
              birth_year: `🎂 ${person1.birth_year || ''} / ${person2.birth_year || ''}`,
              isCouple: true,
              originalIds: [person1.id, person2.id],
              tags: ['couple']
            }
            
            console.log('node created for couple:', node)
            // Store parent info for later resolution
            if (person1.father_id || person1.mother_id) {
              node.tempParentId = person1.father_id || person1.mother_id
            } else if (person2.father_id || person2.mother_id) {
              node.tempParentId = person2.father_id || person2.mother_id
            }
            
            nodes.push(node)
          }
        }
      })
      
      // Second pass: Create single person nodes
      sortedMembers.forEach(member => {
        if (processedSpouses.has(member.id)) return
        
        const node = {
          id: member.id,
          name: member.name + (member.gender === 'male' ? '👦' : '👧') ,
          gender: member.gender,
          birth_year: '🎂' + (member.birth_year || ''),
          death_year: member.death_year || '',
          is_deceased: member.is_deceased,
          tags: []
        }
        
        // Store parent info for later resolution
        if (member.father_id || member.mother_id) {
          node.tempFatherId = member.father_id
          node.tempMotherId = member.mother_id
        }
        
        // Add tags for styling
        if (member.gender === 'male') {
          node.tags.push('male')
        } else {
          node.tags.push('female')
        }
        
        if (member.is_deceased) {
          node.tags.push('deceased')
        }

        nodes.push(node)
      })
      
      // Third pass: Resolve all parent references using the couple map
      nodes.forEach(node => {
        if (node.tempParentId) {
          // For couple nodes
          if (coupleMap.has(node.tempParentId)) {
            node.pid = coupleMap.get(node.tempParentId)
            console.log(`Couple node ${node.id} -> parent couple ${node.pid}`)
          } else {
            node.pid = node.tempParentId
            console.log(`Couple node ${node.id} -> parent single ${node.pid}`)
          }
          delete node.tempParentId
        } else if (node.tempFatherId || node.tempMotherId) {
          // For single nodes, check if parents form a couple
          const fatherId = node.tempFatherId
          const motherId = node.tempMotherId
          
          if (fatherId && coupleMap.has(fatherId)) {
            node.pid = coupleMap.get(fatherId)
            console.log(`Single node ${node.id} (${node.name}) -> parent couple ${node.pid} (via father ${fatherId})`)
          } else if (motherId && coupleMap.has(motherId)) {
            node.pid = coupleMap.get(motherId)
            console.log(`Single node ${node.id} (${node.name}) -> parent couple ${node.pid} (via mother ${motherId})`)
          } else {
            node.pid = fatherId || motherId
            console.log(`Single node ${node.id} (${node.name}) -> parent single ${node.pid}`)
          }
          
          delete node.tempFatherId
          delete node.tempMotherId
        }
      })

      console.log('=== FINAL TRANSFORMED NODES ===')
      nodes.forEach(n => {
        console.log(`Node: ${n.id}, PID: ${n.pid || 'ROOT'}, Name: ${n.name.substring(0, 30)}...`)
      })
      console.log('Couple map:', Object.fromEntries(coupleMap))
      return nodes
    },

    renderTree() {
      // Check if container ref exists
      if (!this.$refs.treeContainer) {
        console.error('Tree container ref not found')
        return
      }

      // Destroy existing chart if any
      if (this.chart) {
        this.chart.destroy()
      }

      const chartData = this.transformToOrgChartData()
      console.log('Rendering OrgChart with nodes:', chartData.length)

      // Initialize Balkan OrgChart
      this.chart = new OrgChart(this.$refs.treeContainer, {
        nodes: chartData,
        
        // Node display configuration
        nodeBinding: {
          field_0: 'name',
          field_1: 'birth_year'
        },

        // Layout configuration for family tree
        template: 'ana',  // Use built-in template
        orientation: OrgChart.orientation.top,
        layout: OrgChart.layout.normal,  // Changed from mixed to normal
        
        // Spacing configuration
        partnerNodeSeparation: 15,  // Closer distance between spouses
        siblingSeparation: 80,       // Distance between siblings
        levelSeparation: 120,        // Distance between generations
        
        // Alignment
        align: OrgChart.align.orientation,
        
        // Initial view
        scaleInitial: 0.8,
        scaleMin: 0.3,
        scaleMax: 2,
        
        // Features
        enableSearch: true,
        enableDragDrop: false,
        mouseScrool: OrgChart.action.zoom,
        
        // Custom templates for styling
        template: 'customFamily',
        
        // Tags for custom styling
        tags: {
          male: {
            template: 'customFamily'
          },
          female: {
            template: 'customFamily'
          },
          deceased: {
            template: 'customFamily'
          }
        },

        // Disable all default modals and menus
        nodeMenu: null,
        nodeMouseClick: OrgChart.action.none,
        menu: null
      })

      // Define custom template
      OrgChart.templates.customFamily = Object.assign({}, OrgChart.templates.ana)
      OrgChart.templates.customFamily.size = [300, 110]
      OrgChart.templates.customFamily.node = 
        '<rect x="0" y="0" height="110" width="300" fill="#3b82f6" stroke-width="3" stroke="#1e3a8a" rx="8" style="cursor: pointer;"></rect>'
      
      OrgChart.templates.customFamily.field_0 = 
        '<text data-text-overflow="multiline" data-width="260" style="font-size: 16px;font-weight:600;fill:#fff;cursor: pointer;" x="140" y="35" text-anchor="middle">{val}</text>'
      
      OrgChart.templates.customFamily.field_1 = 
        '<text data-text-overflow="multiline" data-width="260" style="font-size: 14px;fill:#dbeafe;cursor: pointer;" x="140" y="95" text-anchor="middle">{val}</text>'
      
      OrgChart.templates.customFamily.link = 
        '<path stroke-linejoin="round" stroke="#000000" stroke-width="2px" fill="none" d="{rounded}" />'

      // Event: After chart is rendered
      this.chart.on('init', () => {
        console.log('Family tree initialized')
        this.applyCustomStyling()
      })

      // Event: Re-apply styling after chart redraws (zoom, pan, etc.)
      this.chart.on('redraw', () => {
        // console.log('Chart redrawn - reapplying styles')
        this.applyCustomStyling()
      })

      // Event: Node click - handle clicks on nodes
      this.chart.on('click', (sender, args) => {
        console.log('Click event triggered', args)
        if (args.node) {
          console.log('Showing details for node:', args.node.id)
          this.showMemberDetails(args.node.id)
        }
      })

      // Event: expcollclick (when clicking on expand/collapse buttons)
      this.chart.on('expcollclick', (sender, args) => {
        return true // Allow expand/collapse
      })
    },

    applyCustomStyling() {
      this.$nextTick(() => {
        const nodes = this.chart.config.nodes
        nodes.forEach(node => {
          const nodeElement = document.querySelector(`[data-n-id="${node.id}"]`)
          if (nodeElement) {
            const rect = nodeElement.querySelector('rect')
            if (rect) {
              // For couple nodes, use gradient background
              if (node.isCouple && node.person1 && node.person2) {
                // Create gradient based on genders
                const color1 = node.person1.gender === 'male' ? '#3b82f6' : '#ec4899'
                const color2 = node.person2.gender === 'male' ? '#3b82f6' : '#ec4899'
                
                if (color1 === color2) {
                  rect.setAttribute('fill', color1)
                  rect.setAttribute('stroke', color1 === '#3b82f6' ? '#1e3a8a' : '#be185d')
                } else {
                  // Create gradient for mixed couple
                  const gradientId = `gradient-${node.id}`
                  const svg = rect.closest('svg')
                  
                  if (svg && !svg.querySelector(`#${gradientId}`)) {
                    const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS('http://www.w3.org/2000/svg', 'defs'), svg.firstChild)
                    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
                    gradient.setAttribute('id', gradientId)
                    gradient.setAttribute('x1', '0%')
                    gradient.setAttribute('x2', '100%')
                    
                    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
                    stop1.setAttribute('offset', '50%')
                    stop1.setAttribute('stop-color', color1)
                    
                    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
                    stop2.setAttribute('offset', '50%')
                    stop2.setAttribute('stop-color', color2)
                    
                    gradient.appendChild(stop1)
                    gradient.appendChild(stop2)
                    defs.appendChild(gradient)
                  }
                  
                  rect.setAttribute('fill', `url(#${gradientId})`)
                  rect.setAttribute('stroke', '#7c3aed')
                }
              } else {
                // Single person styling
                const member = this.members.find(m => m.id === node.id)
                if (member) {
                  if (member.gender === 'male') {
                    rect.setAttribute('fill', '#3b82f6')
                    rect.setAttribute('stroke', '#1e3a8a')
                  } else {
                    rect.setAttribute('fill', '#ec4899')
                    rect.setAttribute('stroke', '#be185d')
                  }
                  
                  if (member.is_deceased) {
                    rect.setAttribute('opacity', '0.7')
                    rect.setAttribute('stroke-dasharray', '5,5')
                  }
                }
              }
            }
          }
        })
      })
    },

    showMemberDetails(nodeId) {
      console.log('showMemberDetails called with nodeId:', nodeId)
      
      // Check if this is a couple node by checking if ID contains hyphen
      if (nodeId.includes('-')) {
        console.log('This is a couple node')
        // Split the couple ID to get individual member IDs
        const memberIds = nodeId.split('-')
        console.log('Member IDs:', memberIds)
        
        const person1 = this.members.find(m => m.id === memberIds[0])
        const person2 = this.members.find(m => m.id === memberIds[1])
        
        if (person1 && person2) {
          this.selectedCouple = { person1, person2 }
          console.log('selectedCouple set to:', this.selectedCouple)
        } else {
          console.error('Members not found for ids:', memberIds)
        }
      } else {
        console.log('This is a single person node')
        // Single person
        const member = this.members.find(m => m.id === nodeId)
        console.log('Found member:', member)
        
        if (member) {
          this.selectedMember = member
          console.log('selectedMember set to:', this.selectedMember)
        } else {
          console.error('Member not found for id:', nodeId)
        }
      }
    },

    getParents(member) {
      const parents = []
      if (member.father_id) {
        const father = this.members.find(m => m.id === member.father_id)
        if (father) parents.push(father)
      }
      if (member.mother_id) {
        const mother = this.members.find(m => m.id === member.mother_id)
        if (mother) parents.push(mother)
      }
      return parents
    },

    getSpouses(member) {
      if (!member.spouse_ids || member.spouse_ids.length === 0) return []
      return member.spouse_ids
        .map(spouseId => this.members.find(m => m.id === spouseId))
        .filter(Boolean)
    },

    getChildren(member) {
      return this.members.filter(m => m.father_id === member.id || m.mother_id === member.id)
    },

    getAge(member) {
      if (!member.birth_year) return ''
      
      const endYear = member.is_deceased && member.death_year 
        ? member.death_year 
        : new Date().getFullYear()
      
      const age = endYear - member.birth_year
      
      if (member.is_deceased) {
        return `Lived ${age} years (${member.birth_year} - ${member.death_year})`
      } else {
        return `Age ${age} years (Born ${member.birth_year})`
      }
    },

    zoomIn() {
      if (this.chart) {
        this.chart.zoom(true, null, 0.1)
      }
    },

    zoomOut() {
      if (this.chart) {
        this.chart.zoom(false, null, 0.1)
      }
    },

    resetView() {
      if (this.chart) {
        this.chart.fit()
      }
    }
  },

  mounted() {
    this.loadFamilyTree()
  },

  watch: {
    '$route.query.couple'() {
      // Reload tree when couple filter changes
      this.loadFamilyTree()
    }
  },

  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  }
}
</script>

<style scoped>
.family-tree-view {
  min-height: 100vh;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Custom scrollbar for modal */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 8px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark mode scrollbar */
.dark .max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
