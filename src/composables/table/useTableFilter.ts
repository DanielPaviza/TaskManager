import { computed, ref } from 'vue'

import type { Task } from '@/types/Task'
import type { TaskColumn } from '@/types/TaskColumn'

export function useTableFilter(data: () => Task[], columns: () => TaskColumn[]) {
  const columnFilters = ref<Record<string, string>>({})

  const filteredData = computed(() => {
    let result = data()

    // Apply each column filter
    for (const [columnKey, filterValue] of Object.entries(columnFilters.value)) {
      if (!filterValue || filterValue.trim() === '') continue

      const filterLower = filterValue.toLowerCase().trim()
      const column = columns().find((c) => c.key === columnKey)
      if (!column) continue

      result = result.filter((row) => {
        const cellValue = column.filterVal(row)
        return cellValue.toLowerCase().includes(filterLower)
      })
    }

    return result
  })

  const columnFilterOptions = computed(() => {
    const options: Record<string, Array<{ label: string; value: string }>> = {}

    for (const column of columns()) {
      const uniqueValues = new Set<string>()

      for (const row of data()) {
        const value = column.filterVal(row)
        if (value && value.trim() !== '') uniqueValues.add(value)
      }

      options[String(column.key)] = Array.from(uniqueValues)
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ label: value, value }))
    }

    return options
  })

  const hasActiveFilters = computed(() => {
    return Object.values(columnFilters.value).some((val) => val.trim() !== '')
  })

  function clearFilters(): void {
    columnFilters.value = {}
  }

  return {
    columnFilters,
    filteredData,
    columnFilterOptions,
    hasActiveFilters,
    clearFilters,
  }
}
