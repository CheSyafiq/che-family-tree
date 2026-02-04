<template>
  <div class="family-tree-pure p-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100">Family Tree</h2>
      <p class="text-slate-600 dark:text-slate-400 mt-2">Pure Vue.js family tree visualization</p>
    </div>

    <!-- Controls -->
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800 p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="loadFamilyTree"
            :disabled="loading"
            class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Reload Tree' }}
          </button>

          <div class="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <button
              @click="zoomOut"
              class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Zoom Out"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <span class="text-sm font-medium min-w-[60px] text-center">{{ Math.round(zoomLevel * 100) }}%</span>
            <button
              @click="zoomIn"
              class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Zoom In"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
            <button
              @click="resetZoom"
              class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Reset Zoom"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-4 text-sm">
          <span class="text-slate-600 dark:text-slate-400">Total: <strong>{{ members.length }}</strong></span>
          <span class="text-slate-600 dark:text-slate-400">Living: <strong class="text-green-600">{{ livingCount }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Tree Container -->
    <div v-if="!loading && treeStructure.length > 0" class="tree-container bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800">
      <div class="tree-wrapper" :style="{ transform: `scale(${zoomLevel})` }">
        <!-- Root Level (Couples without parents) -->
        <div v-for="root in treeStructure" :key="root.id" class="family-branch mb-12">
          <!-- Parent Couple -->
          <div class="couple-row">
            <div class="couple-box" @click="selectMember(root.person1)">
              <div class="person-card" :class="getPersonClass(root.person1)">
                <div class="person-name">{{ root.person1.name }}</div>
                <div class="person-year">{{ root.person1.birth_year }}</div>
              </div>
              <div class="plus-sign">+</div>
              <div class="person-card" :class="getPersonClass(root.person2)" @click.stop="selectMember(root.person2)">
                <div class="person-name">{{ root.person2.name }}</div>
                <div class="person-year">{{ root.person2.birth_year }}</div>
              </div>
            </div>
          </div>

          <!-- Connecting Line -->
          <div v-if="root.children.length > 0" class="connector-line"></div>

          <!-- Children Row -->
          <div v-if="root.children.length > 0" class="children-row">
            <div v-for="child in root.children" :key="child.id" class="child-item">
              <!-- Child is married - show as couple -->
              <div v-if="child.isMarried" class="couple-box small" @click="selectMember(child.person)">
                <div class="person-card small" :class="getPersonClass(child.person)">
                  <div class="person-name">{{ child.person.name }}</div>
                  <div class="person-year">{{ child.person.birth_year }}</div>
                </div>
                <div class="plus-sign small">+</div>
                <div class="person-card small" :class="getPersonClass(child.spouse)" @click.stop="selectMember(child.spouse)">
                  <div class="person-name">{{ child.spouse.name }}</div>
                  <div class="person-year">{{ child.spouse.birth_year }}</div>
                </div>
              </div>

              <!-- Child is single -->
              <div v-else class="couple-box small" @click="selectMember(child.person)">
                <div class="person-card small" :class="getPersonClass(child.person)">
                  <div class="person-name">{{ child.person.name }}</div>
                  <div class="person-year">{{ child.person.birth_year }}</div>
                </div>
              </div>

              <!-- Grandchildren (if any) -->
              <div v-if="child.children && child.children.length > 0" class="grandchildren-container">
                <div class="connector-line small"></div>
                <div class="grandchildren-row">
                  <div v-for="grandchild in child.children" :key="grandchild.id" 
                       class="person-card tiny" 
                       :class="getPersonClass(grandchild)"
                       @click="selectMember(grandchild)">
                    <div class="person-name">{{ grandchild.name }}</div>
                    <div class="person-year">{{ grandchild.birth_year }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-slate-600 dark:text-slate-400">Loading family tree...</p>
      </div>
    </div>

    <!-- Member Details Modal -->
    <transition name="modal">
      <div v-if="selectedMember" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="selectedMember = null">
        <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ selectedMember.name }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ selectedMember.gender }} • Born {{ selectedMember.birth_year }}</p>
              </div>
              <button @click="selectedMember = null" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                ✕
              </button>
            </div>
          </div>
          
          <div class="p-6 space-y-4">
            <div v-if="getParents(selectedMember).length > 0">
              <h4 class="font-medium text-slate-900 dark:text-slate-100 mb-2">Parents</h4>
              <div class="space-y-2">
                <div v-for="parent in getParents(selectedMember)" :key="parent.id" 
                     class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                     @click="selectedMember = parent">
                  {{ parent.name }}
                </div>
              </div>
            </div>

            <div v-if="getSpouses(selectedMember).length > 0">
              <h4 class="font-medium text-slate-900 dark:text-slate-100 mb-2">Spouse(s)</h4>
              <div class="space-y-2">
                <div v-for="spouse in getSpouses(selectedMember)" :key="spouse.id"
                     class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                     @click="selectedMember = spouse">
                  {{ spouse.name }}
                </div>
              </div>
            </div>

            <div v-if="getChildren(selectedMember).length > 0">
              <h4 class="font-medium text-slate-900 dark:text-slate-100 mb-2">Children ({{ getChildren(selectedMember).length }})</h4>
              <div class="space-y-2">
                <div v-for="child in getChildren(selectedMember)" :key="child.id"
                     class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                     @click="selectedMember = child">
                  {{ child.name }} ({{ child.birth_year }})
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
export default {
  name: 'FamilyTreePure',
  data() {
    return {
      members: [],
      membersMap: {},
      treeStructure: [],
      loading: false,
      selectedMember: null,
      zoomLevel: 1
    }
  },
  computed: {
    livingCount() {
      return this.members.filter(m => !m.is_deceased).length
    }
  },
  methods: {
    async loadFamilyTree() {
      this.loading = true
      try {
        const response = await fetch('/family-structure.json')
        this.members = await response.json()
        console.log('Members loaded:', this.members)
        // Create map
        this.membersMap = {}
        this.members.forEach(m => this.membersMap[m.id] = m)
        
        this.buildTreeStructure()
        this.loading = false
      } catch (error) {
        console.error('Error loading:', error)
        this.loading = false
      }
    },

    buildTreeStructure() {
      const processed = new Set()
      this.treeStructure = []

      // Find root couples (people whose parents don't exist in the dataset)
      const roots = this.members.filter(m => {
        const fatherExists = m.father_id && this.membersMap[m.father_id]
        const motherExists = m.mother_id && this.membersMap[m.mother_id]
        return !fatherExists && !motherExists
      })
      
      console.log('Root members:', roots)
      
      roots.forEach(person => {
        console.log('Processing root person:', person)
        if (processed.has(person.id)) return

        // Check if this person has a spouse
        if (person.spouse_ids && person.spouse_ids.length > 0) {
          const spouseId = person.spouse_ids[0]
          const spouse = this.membersMap[spouseId]
          console.log('Found spouse for root person:', spouse)

          if (spouse && !processed.has(spouseId)) {
            // Check if spouse's parents exist in dataset
            const spouseParentsExist = (spouse.father_id && this.membersMap[spouse.father_id]) || 
                                       (spouse.mother_id && this.membersMap[spouse.mother_id])
            
            // Skip if spouse has existing parents (they'll be shown in their parent's tree)
            if (spouseParentsExist) {
              console.log('Skipping - spouse has existing parents')
              return
            }

            processed.add(person.id)
            processed.add(spouseId)

            // Determine order (male first)
            const person1 = person.gender === 'male' ? person : spouse
            const person2 = person.gender === 'male' ? spouse : person

            // Build couple node with children
            const coupleNode = {
              id: `${person1.id}-${person2.id}`,
              person1,
              person2,
              children: this.buildChildren(person1, person2, processed)
            }

            this.treeStructure.push(coupleNode)
            console.log('Added couple node:', coupleNode)
          }
        }
      })
      
      console.log('Final tree structure:', this.treeStructure)
    },

    buildChildren(parent1, parent2, processed) {
      const children = []
      
      // Get all children of this couple
      const childMembers = this.members.filter(m => 
        (m.father_id === parent1.id || m.father_id === parent2.id) ||
        (m.mother_id === parent1.id || m.mother_id === parent2.id)
      )

      childMembers.forEach(child => {
        if (processed.has(child.id)) return
        processed.add(child.id)

        const childNode = {
          id: child.id,
          person: child,
          isMarried: false,
          spouse: null,
          children: []
        }

        // Check if child is married
        if (child.spouse_ids && child.spouse_ids.length > 0) {
          const spouseId = child.spouse_ids[0]
          const spouse = this.membersMap[spouseId]
          
          if (spouse && !processed.has(spouseId)) {
            processed.add(spouseId)
            childNode.isMarried = true
            childNode.spouse = spouse
            
            // Get grandchildren
            childNode.children = this.members.filter(m => 
              m.father_id === child.id || m.mother_id === child.id ||
              m.father_id === spouseId || m.mother_id === spouseId
            )
          }
        } else {
          // Single child might still have children
          childNode.children = this.members.filter(m => 
            m.father_id === child.id || m.mother_id === child.id
          )
        }

        children.push(childNode)
      })

      return children
    },

    getPersonClass(person) {
      const classes = []
      if (person.gender === 'male') classes.push('male')
      else classes.push('female')
      if (person.is_deceased) classes.push('deceased')
      return classes.join(' ')
    },

    getParents(member) {
      const parents = []
      if (member.father_id && this.membersMap[member.father_id]) {
        parents.push(this.membersMap[member.father_id])
      }
      if (member.mother_id && this.membersMap[member.mother_id]) {
        parents.push(this.membersMap[member.mother_id])
      }
      return parents
    },

    getSpouses(member) {
      if (!member.spouse_ids) return []
      return member.spouse_ids.map(id => this.membersMap[id]).filter(Boolean)
    },

    getChildren(member) {
      return this.members.filter(m => 
        m.father_id === member.id || m.mother_id === member.id
      )
    },

    selectMember(member) {
      this.selectedMember = member
    },

    zoomIn() {
      this.zoomLevel = Math.min(1.5, this.zoomLevel + 0.1)
    },

    zoomOut() {
      this.zoomLevel = Math.max(0.4, this.zoomLevel - 0.1)
    },

    resetZoom() {
      this.zoomLevel = 1
    }
  },

  created() {
    this.loadFamilyTree()
  }
}
</script>

<style scoped>
.tree-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px;
  min-height: 600px;
}

.tree-wrapper {
  transform-origin: center top;
  transition: transform 0.3s ease;
  min-width: fit-content;
}

.family-branch {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.couple-row {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.couple-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.couple-box.small {
  padding: 12px;
  gap: 8px;
}

.person-card {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
  min-width: 200px;
}

.person-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.person-card.male {
  border-color: #3b82f6;
  background: linear-gradient(to bottom, #eff6ff, #dbeafe);
}

.person-card.female {
  border-color: #ec4899;
  background: linear-gradient(to bottom, #fdf2f8, #fce7f3);
}

.person-card.deceased {
  opacity: 0.7;
  border-style: dashed;
}

.person-card.small {
  padding: 12px 16px;
  min-width: 160px;
}

.person-card.tiny {
  padding: 10px 14px;
  min-width: 140px;
  margin: 0 8px;
}

.person-name {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.4;
}

.person-year {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.plus-sign {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.plus-sign.small {
  font-size: 18px;
}

.connector-line {
  width: 3px;
  height: 40px;
  background: #cbd5e1;
  margin: 0 auto;
}

.connector-line.small {
  height: 30px;
}

.children-row {
  display: flex;
  gap: 24px;
  flex-wrap: nowrap;
  justify-content: center;
  position: relative;
}

.children-row::before {
  content: '';
  position: absolute;
  top: -40px;
  left: 5%;
  right: 5%;
  height: 3px;
  background: #cbd5e1;
  z-index: 0;
}

.child-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.child-item::before {
  content: '';
  position: absolute;
  top: -40px;
  left: 50%;
  width: 3px;
  height: 40px;
  background: #cbd5e1;
}

.grandchildren-container {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grandchildren-row {
  display: flex;
  gap: 12px;
  flex-wrap: nowrap;
  justify-content: center;
}

/* Dark mode */
.dark .couple-box {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.dark .person-card {
  background: #1e293b;
  color: #f1f5f9;
}

.dark .person-card.male {
  background: linear-gradient(to bottom, #1e3a5f, #1e293b);
}

.dark .person-card.female {
  background: linear-gradient(to bottom, #4a1942, #1e293b);
}

.dark .person-name {
  color: #f1f5f9;
}

.dark .person-year {
  color: #94a3b8;
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
</style>
