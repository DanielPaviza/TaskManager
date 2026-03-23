import { computed, ref } from 'vue'

import type { Spending } from '@/types/Task'
import type { SpendingColumn } from '@/types/TaskColumn'

export function useTableSort(data: () => Spending[], columns: () => SpendingColumn[]) {
  const sortState = ref<{ key: string | null; direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null,
  })

  const sortedData = computed(() => {
    if (!sortState.value.key || !sortState.value.direction) return data()

    const col = columns().find((c) => c.key === sortState.value.key && c.sortFn)
    if (!col || !col.sortFn) return data()

    const sorted = [...data()].sort(col.sortFn)
    if (sortState.value.direction === 'desc') sorted.reverse()

    return sorted
  })

  function updateSort(key: string, direction: 'asc' | 'desc' | null): void {
    if (direction === null) sortState.value = { key: null, direction: null }
    else sortState.value = { key, direction }
  }

  function clearSort(): void {
    sortState.value = { key: null, direction: null }
  }

  return {
    sortState,
    sortedData,
    updateSort,
    clearSort,
  }
}
