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
  const { tasks, tags } = storeToRefs(store)

  const sortBy = ref<SortType>('alphabetical')

  const { sortedStats } = useEntityStats({
    tasks: tasks,
    entities: tags,
    filterFn: (s, tag) => s.tags && s.tags.includes(tag),
    sortBy,
  })

  const { displayedItems: displayedTags, hasMore, toggleText, showAll } = useItemsLimit(sortedStats)

  const { chartLabels, chartDatasets } = useSummaryChart({
    stats: sortedStats,
    sortBy,
    labelKey: 'summary.expensesByTags',
    countLabelKey: 'summary.tasksByTagsCount',
  })

  const sortOptions = computed(() => [
    { value: 'count-desc' as SortType, label: `${t('summary.count')} ↓` },
    { value: 'alphabetical' as SortType, label: 'A-Z' },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.expensesByTags')"
    :subtitle="`${tags.length} ${$t('summary.tags')}`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <template v-if="displayedTags.length">
      <SortButtons v-model="sortBy" :options="sortOptions" />

      <StatItem v-for="tag in displayedTags" :key="tag.name" :stat="tag" />

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
