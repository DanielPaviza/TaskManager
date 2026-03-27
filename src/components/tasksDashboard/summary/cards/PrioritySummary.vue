<script setup lang="ts">
  import { type SortType, useEntityStats } from '@composables/useEntityStats'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSummaryChart } from '@composables/useSummaryChart'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import PriorityDot from '@/components/shared/PriorityDot.vue'
  import SortButtons from '@/components/tasksDashboard/summary/SortButtons.vue'
  import StatItem from '@/components/tasksDashboard/summary/StatItem.vue'
  import SummaryCard from '@/components/tasksDashboard/summary/SummaryCard.vue'
  import { useTasksStore } from '@/stores/tasksStore'
  import { PRIORITY_CHART_COLORS } from '@/utils/priorityUtils'

  const { t } = useI18n()
  const store = useTasksStore()
  const { tasks, priorities } = storeToRefs(store)

  // Convert number priorities to strings for useEntityStats
  const priorityEntities = computed(() => priorities.value.map(String))

  const sortBy = ref<SortType>('alphabetical')

  const { sortedStats } = useEntityStats({
    tasks: tasks,
    entities: priorityEntities,
    filterFn: (s, priority) => s.priority.toString() === priority,
    sortBy,
  })

  const {
    displayedItems: displayedPriorities,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(sortedStats)

  const { chartLabels, chartDatasets } = useSummaryChart({
    stats: sortedStats,
    sortBy,
    labelKey: 'summary.expensesByPriorities',
    countLabelKey: 'summary.tasksByPriorityCount',
    customColors: PRIORITY_CHART_COLORS,
  })

  const sortOptions = computed(() => [
    { value: 'count-desc' as SortType, label: `${t('summary.count')} ↓` },
    { value: 'alphabetical' as SortType, label: 'A-Z' },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.expensesByPriorities')"
    :subtitle="`${priorities.length} ${$t('summary.priorities')}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <template v-if="displayedPriorities.length">
      <SortButtons v-model="sortBy" :options="sortOptions" />

      <div v-for="stat in displayedPriorities" :key="stat.name" class="flex items-center gap-2">
        <PriorityDot :priority="Number(stat.name)" :size="12" />
        <StatItem :stat="stat" />
      </div>

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
