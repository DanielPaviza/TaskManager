<script setup lang="ts">
  import { type SortType, useEntityStats } from '@composables/useEntityStats'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSummaryChart } from '@composables/useSummaryChart'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import SortButtons from '@/components/tasksDashboard/summary/SortButtons.vue'
  import StatItem from '@/components/tasksDashboard/summary/StatItem.vue'
  import SummaryCard from '@/components/tasksDashboard/summary/SummaryCard.vue'
  import { useTasksStore } from '@/stores/tasksStore'

  const { t } = useI18n()
  const store = useTasksStore()
  const { allTasks, projects } = storeToRefs(store)

  const sortBy = ref<SortType>('count-desc')

  const { sortedStats } = useEntityStats({
    tasks: allTasks,
    entities: projects,
    filterFn: (s, project) => s.project === project,
    sortBy,
  })

  const {
    displayedItems: displayedProjects,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(sortedStats)

  const { chartLabels, chartDatasets } = useSummaryChart({
    stats: sortedStats,
    sortBy,
    labelKey: 'summary.expensesByProjects',
    countLabelKey: 'summary.tasksByProjectCount',
  })

  const sortOptions = computed(() => [
    { value: 'count-desc' as SortType, label: `${t('summary.count')} ↓` },
    { value: 'alphabetical' as SortType, label: 'A-Z' },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.expensesByProjects')"
    :subtitle="`${projects.length} ${$t('summary.projects')}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <template v-if="displayedProjects.length">
      <SortButtons v-model="sortBy" :options="sortOptions" />

      <StatItem v-for="project in displayedProjects" :key="project.name" :stat="project" />

      <div
        v-if="hasMore"
        class="mt-1 text-blueLight text-xs cursor-pointer"
        @click="showAll = !showAll"
      >
        {{ toggleText }}
      </div>
    </template>
    <div v-else class="text-gray-500 text-center py-4">
      {{ $t('common.noRecordsFound') }}
    </div>
  </SummaryCard>
</template>
