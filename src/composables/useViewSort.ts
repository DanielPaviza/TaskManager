import { ref } from 'vue'

import { Task } from '@/types/Task'

type SortState = 'none' | 'asc' | 'desc'

export function useViewSort() {
  const nameSortState = ref<SortState>('asc') // Default to alphabetically ascending
  const countSortState = ref<SortState>('none')

  const toggleNameSort = (): void => {
    if (nameSortState.value === 'none') {
      nameSortState.value = 'asc'
      countSortState.value = 'none'
    } else if (nameSortState.value === 'asc') {
      nameSortState.value = 'desc'
      countSortState.value = 'none'
    } else nameSortState.value = 'none'
  }

  const toggleCountSort = (): void => {
    if (countSortState.value === 'none') {
      countSortState.value = 'asc'
      nameSortState.value = 'none'
    } else if (countSortState.value === 'asc') {
      countSortState.value = 'desc'
      nameSortState.value = 'none'
    } else countSortState.value = 'none'
  }

  // Sort categories by name or total count
  const getSortedCategories = <T extends { getTasks: (category: string) => Task[] }>(
    categories: string[],
    view: T,
  ): string[] => {
    const sorted = [...categories]

    if (nameSortState.value !== 'none')
      sorted.sort((a, b) => {
        const comparison = a.localeCompare(b, 'cs')
        return nameSortState.value === 'asc' ? comparison : -comparison
      })
    else if (countSortState.value !== 'none')
      sorted.sort((a, b) => {
        const tasksA = view.getTasks(a)
        const tasksB = view.getTasks(b)
        const comparison = tasksA.length - tasksB.length
        return countSortState.value === 'asc' ? comparison : -comparison
      })

    return sorted
  }

  return {
    nameSortState,
    countSortState,
    toggleNameSort,
    toggleCountSort,
    getSortedCategories,
  }
}
