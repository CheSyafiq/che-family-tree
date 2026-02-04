<template>
  <div class="family-tree-test p-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100">Family Tree Visualization</h2>
      <p class="text-slate-600 dark:text-slate-400 mt-2">Interactive family tree from JSON data</p>
    </div>

    <!-- Controls -->
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800 p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <button
          @click="loadJsonData"
          class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Icon icon="heroicons:arrow-path" :class="{ 'animate-spin': loading }" class="w-5 h-5" />
          Load JSON Data
        </button>

        <div class="ml-auto flex items-center gap-2">
          <span class="text-sm text-slate-600 dark:text-slate-400">Members: {{ members.length }}</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon icon="heroicons:arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <!-- Tree Container -->
    <div v-else-if="members.length > 0" class="bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800 p-6">
      <!-- OrgChart Container -->
      <div ref="treeContainer" class="border border-slate-200 dark:border-slate-700 rounded-lg" style="min-height: 600px;"></div>

      <!-- Legend -->
      <div class="mt-6 flex flex-wrap gap-4 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-blue-500"></div>
          <span class="text-slate-700 dark:text-slate-300">Male</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-pink-500"></div>
          <span class="text-slate-700 dark:text-slate-300">Female</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full border-2 border-slate-400 bg-slate-100"></div>
          <span class="text-slate-700 dark:text-slate-300">Deceased</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-12 h-0.5 bg-red-500"></div>
          <span class="text-slate-700 dark:text-slate-300">Spouse Link</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-slate-900 rounded-lg shadow p-12 text-center border border-slate-200 dark:border-slate-800">
      <Icon icon="heroicons:users" class="w-16 h-16 mx-auto text-slate-400 mb-4" />
      <h3 class="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">No Data Loaded</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-6">Click the button above to load family data from JSON</p>
    </div>

    <!-- Member Details Modal -->
    <div v-if="selectedMember" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="selectedMember = null">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ selectedMember.name }}</h3>
          <button
            @click="selectedMember = null"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <Icon icon="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon icon="heroicons:user" class="w-5 h-5 text-slate-400" />
            <span class="text-slate-600 dark:text-slate-400">ID:</span>
            <span class="font-medium text-slate-900 dark:text-slate-100">{{ selectedMember.id }}</span>
          </div>

          <div class="flex items-center gap-2">
            <Icon icon="heroicons:user-circle" class="w-5 h-5 text-slate-400" />
            <span class="text-slate-600 dark:text-slate-400">Gender:</span>
            <span class="font-medium text-slate-900 dark:text-slate-100 capitalize">{{ selectedMember.gender }}</span>
          </div>
          
          <div v-if="selectedMember.birth_year" class="flex items-center gap-2">
            <Icon icon="heroicons:cake" class="w-5 h-5 text-slate-400" />
            <span class="text-slate-600 dark:text-slate-400">Born:</span>
            <span class="font-medium text-slate-900 dark:text-slate-100">{{ selectedMember.birth_year }}</span>
          </div>
          
          <div v-if="selectedMember.is_deceased && selectedMember.death_year" class="flex items-center gap-2">
            <Icon icon="heroicons:calendar" class="w-5 h-5 text-slate-400" />
            <span class="text-slate-600 dark:text-slate-400">Died:</span>
            <span class="font-medium text-slate-900 dark:text-slate-100">{{ selectedMember.death_year }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <Icon icon="heroicons:heart" class="w-5 h-5 text-slate-400" />
            <span class="text-slate-600 dark:text-slate-400">Status:</span>
            <span :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              selectedMember.is_deceased 
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            ]">
              {{ selectedMember.is_deceased ? 'Deceased' : 'Living' }}
            </span>
          </div>

          <!-- Parents -->
          <div v-if="getParents(selectedMember).length > 0" class="pt-3 border-t border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-2 mb-2">
              <Icon icon="heroicons:users" class="w-5 h-5 text-slate-400" />
              <span class="text-slate-600 dark:text-slate-400 font-medium">Parents:</span>
            </div>
            <ul class="ml-7 space-y-1">
              <li v-for="parent in getParents(selectedMember)" :key="parent.id" class="text-sm text-slate-700 dark:text-slate-300">
                {{ parent.name }}
              </li>
            </ul>
          </div>

          <!-- Spouses -->
          <div v-if="getSpouses(selectedMember).length > 0" class="pt-3 border-t border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-2 mb-2">
              <Icon icon="heroicons:heart" class="w-5 h-5 text-slate-400" />
              <span class="text-slate-600 dark:text-slate-400 font-medium">Spouse(s):</span>
            </div>
            <ul class="ml-7 space-y-1">
              <li v-for="spouse in getSpouses(selectedMember)" :key="spouse.id" class="text-sm text-slate-700 dark:text-slate-300">
                {{ spouse.name }}
              </li>
            </ul>
          </div>

          <!-- Children -->
          <div v-if="getChildren(selectedMember).length > 0" class="pt-3 border-t border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-2 mb-2">
              <Icon icon="heroicons:user-group" class="w-5 h-5 text-slate-400" />
              <span class="text-slate-600 dark:text-slate-400 font-medium">Children:</span>
            </div>
            <ul class="ml-7 space-y-1">
              <li v-for="child in getChildren(selectedMember)" :key="child.id" class="text-sm text-slate-700 dark:text-slate-300">
                {{ child.name }}
              </li>
            </ul>
          </div>
        </div>

        <button
          @click="selectedMember = null"
          class="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'
import OrgChart from '@balkangraph/orgchart.js'

export default {
  name: 'FamilyTreeTest',
  components: {
    Icon
  },
  data() {
    return {
      members: [],
      loading: false,
      selectedMember: null,
      chart: null
    }
  },
  methods: {
    async loadJsonData() {
      this.loading = true
      try {
        const response = await fetch('/family-structure.json')
        const data = await response.json()
        this.members = data
        console.log('Loaded members:', this.members.length)
        
        this.$nextTick(() => {
          this.renderTree()
        })
      } catch (error) {
        console.error('Error loading JSON:', error)
        alert('Failed to load family-structure.json')
      } finally {
        this.loading = false
      }
    },

    transformToOrgChartData() {
      const nodes = []
      
      this.members.forEach(member => {
        const node = {
          id: member.id,
          name: member.name,
          gender: member.gender,
          birth_year: member.birth_year,
          death_year: member.death_year,
          is_deceased: member.is_deceased,
          img: member.gender === 'male' 
            ? 'https://cdn.balkan.app/shared/m-"' + Math.floor(Math.random() * 10) + '.png'
            : 'https://cdn.balkan.app/shared/f-' + Math.floor(Math.random() * 10) + '.png'
        }

        // Set parent - use father if available, otherwise mother
        if (member.father_id) {
          node.pid = member.father_id
        } else if (member.mother_id) {
          node.pid = member.mother_id
        }

        // Set partner/spouse
        if (member.spouse_ids && member.spouse_ids.length > 0) {
          node.pids = member.spouse_ids
        }

        nodes.push(node)
      })

      return nodes
    },

    renderTree() {
      if (this.chart) {
        this.chart.destroy()
      }

      const chartData = this.transformToOrgChartData()
      console.log('OrgChart data:', chartData)

      this.chart = new OrgChart(this.$refs.treeContainer, {
        nodes: chartData,
        nodeBinding: {
          field_0: 'name',
          field_1: 'birth_year',
          img_0: 'img'
        },
        enableSearch: true,
        enableDragDrop: false,
        scaleInitial: 0.8,
        template: 'family',
        orientation: OrgChart.orientation.top,
        layout: OrgChart.layout.mixed,
        partnerNodeSeparation: 30,
        siblingSeparation: 80,
        levelSeparation: 100,
        tags: {
          male: {
            template: 'male'
          },
          female: {
            template: 'female'
          },
          deceased: {
            template: 'deceased'
          }
        },
        nodeMenu: {
          details: {
            text: 'Details',
            onClick: (nodeId) => {
              const member = this.members.find(m => m.id === nodeId)
              if (member) {
                this.selectedMember = member
              }
            }
          }
        }
      })

      // Add custom styling for deceased members
      this.chart.on('init', (sender) => {
        this.members.forEach(member => {
          if (member.is_deceased) {
            const node = sender.getNode(member.id)
            if (node && node.element) {
              node.element.style.opacity = '0.7'
              node.element.style.border = '2px dashed #94a3b8'
            }
          }
        })
      })

      // Add tags based on gender and status
      this.members.forEach(member => {
        const node = this.chart.getNode(member.id)
        if (node) {
          node.tags = []
          if (member.gender === 'male') {
            node.tags.push('male')
          } else {
            node.tags.push('female')
          }
          if (member.is_deceased) {
            node.tags.push('deceased')
          }
        }
      })
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

    zoomIn() {
      if (this.chart) {
        const scale = this.chart.config.scale + 0.1
        this.chart.zoom(scale, [this.chart.width() / 2, this.chart.height() / 2])
      }
    },

    zoomOut() {
      if (this.chart) {
        const scale = this.chart.config.scale - 0.1
        this.chart.zoom(scale, [this.chart.width() / 2, this.chart.height() / 2])
      }
    },

    resetView() {
      if (this.chart) {
        this.chart.fit()
      }
    }
  },

  mounted() {
    this.loadJsonData()
  },

  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  }
}
</script>

<style scoped>
.family-tree-test {
  min-height: 100vh;
}


/* OrgChart custom styles */
[data-n-id] {
  cursor: pointer;
}

[data-n-id]:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
}


/* Tree node custom styles */
.tree-node {
  padding: 12px 16px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  white-space: pre-line;
  text-align: center;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

.tree-node:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.male-node {
  border: 3px solid #3b82f6;
  background: #eff6ff;
}

.female-node {
  border: 3px solid #ec4899;
  background: #fdf2f8;
}

.deceased-node {
  opacity: 0.7;
  border-style: dashed !important;
}

/* Tree lines */
.tree-chart-line {
  stroke: #94a3b8;
  stroke-width: 2px;
}


.family-tree-test {
  min-height: 100vh;
}

.tree-container {
  min-height: 600px;
  padding: 20px;
}
</style>
