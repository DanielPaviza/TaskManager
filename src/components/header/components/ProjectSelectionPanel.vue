<script setup lang="ts">
  import { CloseOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, onBeforeUnmount, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  import ProjectStatCard from '@/components/header/components/ProjectStatCard.vue'
  import { useProjectStats } from '@/composables/useProjectStat'
  import { useTasksStore } from '@/stores/tasksStore'

  const emit = defineEmits<{
    (e: 'select', project: string | null): void
    (e: 'close'): void
  }>()

  const { t } = useI18n()
  const store = useTasksStore()
  const { projectView } = storeToRefs(store)

  const { projectStats, allProjectsStat, isSelected } = useProjectStats(projectView)

  type ProjectCardVm = {
    key: string
    project: string | null
    title: string
    count: number
    color: string
    selected: boolean
    canBeEdited: boolean
  }

  const monthLabel = computed(() => t('categoryPanel.month'))

  const cards = computed<ProjectCardVm[]>(() => {
    const all = allProjectsStat.value

    const allCard: ProjectCardVm = {
      key: '__all__',
      project: null,
      title: t('common.allCategories'),
      count: all.count,
      color: all.color,
      selected: isSelected(null),
      canBeEdited: false,
    }

    const projectCards: ProjectCardVm[] = projectStats.value.map((stat) => ({
      key: stat.name,
      project: stat.name,
      title: stat.name,
      count: stat.count,
      color: stat.color,
      selected: isSelected(stat.name),
      canBeEdited: true,
    }))

    return [allCard, ...projectCards]
  })

  const handleSelectProject = (project: string | null) => {
    emit('select', project)
  }

  // Listen for Escape key to emit 'close'
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') emit('close')
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
</script>

<template>
  <div class="category-selection-panel-root flex h-full flex-col">
    <div
      class="sticky top-0 z-10 backdrop-blur-sm pt-8 pb-3 mb-4 border-b border-blue flex justify-between items-center"
    >
      <h2 class="text-2xl font-bold text-blue">
        {{ t('header.selectCategory') }}
      </h2>
      <n-button tertiary color="#3b82f6" @click="emit('close')">
        <n-icon size="32">
          <CloseOutline />
        </n-icon>
        <div class="font-bold">
          {{ $t('common.close') }}
        </div>
      </n-button>
    </div>

    <div
      class="grid min-h-0 overflow-y-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ProjectStatCard
        v-for="card in cards"
        :key="card.key"
        :title="card.title"
        :count="card.count"
        :month-label="monthLabel"
        :color="card.color"
        :selected="card.selected"
        :can-be-edited="card.canBeEdited"
        @click="handleSelectProject(card.project)"
      />
    </div>
  </div>
</template>

<style scoped>
  .category-selection-panel-root {
    min-height: 0;
  }
</style>
