<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button 
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Icon icon="heroicons:bars-3" class="w-6 h-6" />
            </button>
            <h1 class="ml-2 text-xl font-bold text-slate-900 dark:text-slate-100">{{ t('navbar.appTitle') }}</h1>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Language Switcher -->
            <div class="relative">
              <button 
                @click="showLanguageMenu = !showLanguageMenu"
                class="flex items-center gap-2 p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :title="t('navbar.language')"
              >
                <Icon icon="heroicons:language" class="w-5 h-5" />
                <span class="hidden sm:block text-sm font-medium">{{ currentLangCode }}</span>
              </button>
              
              <!-- Language Dropdown Menu -->
              <div 
                v-if="showLanguageMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border border-slate-200 dark:border-slate-700 z-50"
              >
                <button 
                  @click="changeLang('en')"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                >
                  <span>{{ t('navbar.english') }}</span>
                  <Icon v-if="languageState.currentLang === 'en'" icon="heroicons:check" class="w-4 h-4 text-primary" />
                </button>
                <button 
                  @click="changeLang('ms')"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                >
                  <span>{{ t('navbar.malay') }}</span>
                  <Icon v-if="languageState.currentLang === 'ms'" icon="heroicons:check" class="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>

            <!-- Dark Mode Toggle -->
            <button 
              @click="toggleDarkMode"
              class="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              :title="isDark ? t('navbar.lightMode') : t('navbar.darkMode')"
            >
              <Icon :icon="isDark ? 'heroicons:sun' : 'heroicons:moon'" class="w-5 h-5" />
            </button>
            
            <!-- User Menu -->
            <div v-if="authState.user" class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon icon="heroicons:user-circle" class="w-6 h-6" />
                <span class="hidden sm:block text-sm">{{ authState.user.email }}</span>
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border border-slate-200 dark:border-slate-700 z-50"
              >
                <button 
                  @click="handleSignOut"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Icon icon="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
                  {{ t('navbar.signOut') }}
                </button>
              </div>
            </div>
            
            <!-- Login Button for Guests -->
            <router-link
              v-else
              to="/login"
              class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
            >
              <Icon icon="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
              <span class="hidden sm:block">{{ t('navbar.login') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <aside 
        :class="[
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
        class="top-16"
      >
        <nav class="p-4 space-y-2">
          <template v-for="item in menuItems" :key="item.route">
            <!-- Menu item without submenu -->
            <router-link
              v-if="!item.hasSubmenu"
              :to="item.route"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              :class="{ 'bg-primary text-white hover:bg-primary': $route.path === item.route }"
            >
              <Icon :icon="item.icon" class="w-5 h-5" />
              <span>{{ t(item.titleKey) }}</span>
            </router-link>
            
            <!-- Menu item with submenu -->
            <div v-else>
              <button
                @click="toggleSubmenu(item.route)"
                class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-blue-400 dark:hover:bg-blue-800 transition-colors"
                :class="{ 'bg-primary text-white hover:bg-primary': $route.path === item.route && !$route.query.couple }"
              >
                <div class="flex items-center gap-3">
                  <Icon :icon="item.icon" class="w-5 h-5" />
                  <span>{{ t(item.titleKey) }}</span>
                </div>
                <Icon 
                  icon="heroicons:chevron-down" 
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': expandedMenu === item.route }"
                />
              </button>
              
              <!-- Submenu -->
              <div
                v-if="expandedMenu === item.route"
                class="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-4"
              >
                <!-- All Families option -->
                <router-link
                  :to="item.route"
                  class="block px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  :class="{ 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100': $route.path === item.route && !$route.query.couple }"
                >
                  {{ t('tree.allFamilies') }}
                </router-link>
                
                <!-- Couple options -->
                <button
                  v-for="couple in couples"
                  :key="couple.id"
                  @click="navigateToCouple(couple.id)"
                  class="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  :class="{ 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100': $route.query.couple === couple.id }"
                >
                  {{ couple.label }}
                </button>
              </div>
            </div>
          </template>
        </nav>
      </aside>

      <!-- Overlay for mobile -->
      <div 
        v-if="sidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
      ></div>

      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'
import { authState, signOut } from '../composables/useAuth'
import { darkModeState, toggleDarkMode } from '../composables/useDarkMode'
import { languageState, setLanguage } from '../composables/useLanguage'
import { translate } from '../locales'
import { getAllMembers } from '../api/memberService'

export default {
  name: 'AdminLayout',
  components: {
    Icon
  },
  data() {
    return {
      authState,
      darkModeState,
      languageState,
      sidebarOpen: false,
      showUserMenu: false,
      showLanguageMenu: false,
      expandedMenu: null,
      couples: [],
      menuItems: [
        {
          titleKey: 'sidebar.dashboard',
          route: '/',
          icon: 'heroicons:home'
        },
        {
          titleKey: 'sidebar.members',
          route: '/members',
          icon: 'heroicons:users'
        },
        {
          titleKey: 'sidebar.familyTree',
          route: '/tree',
          icon: 'heroicons:square-3-stack-3d',
          hasSubmenu: true
        },
        // {
        //   titleKey: 'sidebar.pureVueTree',
        //   route: '/tree-pure',
        //   icon: 'heroicons:sparkles'
        // }
      ]
    }
  },
  computed: {
    isDark() {
      return this.darkModeState.isDark
    },
    currentLangCode() {
      return this.languageState.currentLang.toUpperCase()
    }
  },
  methods: {
    toggleDarkMode,
    t(key, params) {
      return translate(this.languageState.currentLang, key, params)
    },
    changeLang(lang) {
      setLanguage(lang)
      this.showLanguageMenu = false
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    toggleSubmenu(route) {
      this.expandedMenu = this.expandedMenu === route ? null : route
    },
    async loadCouples() {
      try {
        const members = await getAllMembers()
        const processedSpouses = new Set()
        const couplesList = []
        
        members.forEach(member => {
          if (processedSpouses.has(member.id)) return
          
          const hasSpouse = member.spouse_ids && member.spouse_ids.length > 0
          
          if (hasSpouse) {
            const spouseId = member.spouse_ids[0]
            const spouse = members.find(m => m.id === spouseId)
            
            if (spouse) {
              processedSpouses.add(member.id)
              processedSpouses.add(spouseId)
              
              // Determine order (male first)
              const person1 = member.gender === 'male' ? member : spouse
              const person2 = member.gender === 'male' ? spouse : member
              
              const coupleId = `${person1.id}-${person2.id}`
              
              couplesList.push({
                id: coupleId,
                label: `${person1.name} & ${person2.name}`,
                person1Id: person1.id,
                person2Id: person2.id
              })
            }
          }
        })
        
        this.couples = couplesList
      } catch (error) {
        console.error('Error loading couples:', error)
      }
    },
    navigateToCouple(coupleId) {
        this.$router.push({
            path: '/tree',
            query: { couple: coupleId }
        })
        this.sidebarOpen = false
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    },
    async handleSignOut() {
      try {
        await signOut()
        this.$router.push('/login')
      } catch (error) {
        console.error('Sign out error:', error)
      }
    }
  },
  mounted() {
    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        this.showUserMenu = false
        this.showLanguageMenu = false
      }
    })
    
    // Load couples for submenu
    this.loadCouples()
  }
}
</script>
