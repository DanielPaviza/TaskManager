<script setup lang="ts">
  import Tooltip from '@components/shared/Tooltip.vue'
  import SortIndicator from '@components/spendingsList/SortIndicator.vue'

  import { onBeforeUpdate, ref } from 'vue'
  import type { ComponentPublicInstance } from 'vue'

  import type { SpendingColumn } from '@/types/TaskColumn'

  const { columns, sortState, additionalColumnTitle } = defineProps<{
    columns: SpendingColumn[]
    sortState: { key: string | null; direction: 'asc' | 'desc' | null }
    additionalColumnTitle?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:sort', key: string, direction: 'asc' | 'desc' | null): void
  }>()

  type SortIndicatorInstance = ComponentPublicInstance<{ toggleSort: () => void }>
  const sortIndicatorRefs = ref<(SortIndicatorInstance | null)[]>([])

  function setSortIndicatorRef(idx: number, el: Element | ComponentPublicInstance | null): void {
    if (el && typeof (el as SortIndicatorInstance).toggleSort === 'function')
      sortIndicatorRefs.value[idx] = el as SortIndicatorInstance
    else if (el === null) sortIndicatorRefs.value[idx] = null
  }

  onBeforeUpdate(() => {
    sortIndicatorRefs.value = []
  })

  function updateSort(key: string, direction: 'asc' | 'desc' | null): void {
    emit('update:sort', key, direction)
  }
</script>

<template>
  <thead>
    <tr class="bg-blue-300 text-[15px]">
      <th
        v-for="(column, colIdx) in columns"
        :key="String(column.key)"
        class="ps-4 pe-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer hover:bg-blue-500 hover:text-white"
        :class="{ 'bg-blue-400': sortState.key === column.key }"
        @click="column.sortFn && sortIndicatorRefs[colIdx]?.toggleSort()"
      >
        <span class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-white">{{ column.title }}</span>
            <Tooltip v-if="!!column.tooltip" :text="column.tooltip" color="white" />
          </div>

          <SortIndicator
            v-if="column.sortFn"
            :ref="(el) => setSortIndicatorRef(colIdx, el)"
            :active="sortState.key === column.key"
            :direction="sortState.key === column.key ? sortState.direction : null"
            @update:direction="(dir) => updateSort(String(column.key), dir)"
          />
        </span>
      </th>
      <th
        v-if="additionalColumnTitle"
        class="ps-4 pe-2 py-2 text-left font-semibold whitespace-nowrap text-white"
      >
        {{ additionalColumnTitle }}
      </th>
      <th v-else />
    </tr>
  </thead>
</template>

<style scoped>
  thead tr:first-child th .sortIndicator {
    color: #3b82f6;
  }
  thead tr:first-child th:hover .sortIndicator {
    color: white;
  }
  thead tr:first-child th:first-child {
    border-radius: 6px 0 0 0;
  }
  thead tr:first-child th:last-child {
    border-radius: 0 6px 0 0;
  }
  th:hover .sortIndicator {
    stroke: #3b82f6;
  }
</style>
