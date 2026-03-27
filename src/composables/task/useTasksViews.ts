import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSettingsStore } from '@/stores/settingsStore'
import { useTasksStore } from '@/stores/tasksStore'
import type { Task } from '@/types/Task'
import { TaskList, TaskListKey } from '@/types/TaskList'

export function useTasksViews() {
  const { t } = useI18n()
  const tasksStore = useTasksStore()
  const { settings } = useSettingsStore()

  // Check if a specific project is selected
  const isProjectSelected = computed(() => tasksStore.projectView !== null)

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    tasksStore.tasks.forEach((t: Task) => {
      if (t.tags && t.tags.length > 0) t.tags.forEach((tag: string) => tagSet.add(tag))
    })
    return [...tagSet].sort()
  })

  const tasksByTag = computed(() => {
    const map = new Map<string, Task[]>()
    tasksStore.tasks.forEach((task: Task) => {
      if (task.tags.length === 0) {
        if (!map.has(t('table.noTag'))) map.set(t('table.noTag'), [])

        map.get(t('table.noTag'))!.push(task)
      }
      task.tags.forEach((tag: string) => {
        if (!map.has(tag)) map.set(tag, [])

        map.get(tag)!.push(task)
      })
    })
    return map
  })

  const getTasksByTag = (tag: string): Task[] => tasksByTag.value.get(tag) || []

  // Helper function for sorting tasks
  const getSortedTasks = (tasks: Task[], nameSortState: 'none' | 'asc' | 'desc'): Task[] => {
    const sorted = [...tasks]

    if (nameSortState !== 'none')
      sorted.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name, 'cs')
        return nameSortState === 'asc' ? comparison : -comparison
      })

    console.log(
      'Sorted tasks:',
      sorted.map((t) => t.name),
    ) // Debug log to verify sorting

    return sorted
  }

  const getHiddenColumnsForView = (defaultColumns: string[] = []): string[] => [
    ...settings.defaultHiddenTaskColumns,
    ...defaultColumns,
  ]

  // View definitions factory
  const createViews = (nameSortState: 'none' | 'asc' | 'desc'): Record<TaskListKey, TaskList> => ({
    allInOne: {
      id: 'allInOne',
      label: t('table.allInOneTable'),
      categories: [t('table.allExpenses')],
      hiddenColumnKeys: getHiddenColumnsForView(),
      enableSorting: false,
      showFilter: false,
      getTasks: (_: string): Task[] => getSortedTasks(tasksStore.tasks, nameSortState),
    },
    // TODO BY SEVERITY, STATE
    byTags: {
      id: 'byTags',
      label: t('table.byTags'),
      categories: allTags.value,
      hiddenColumnKeys: getHiddenColumnsForView(),
      enableSorting: true,
      showFilter: true,
      getTasks: (tag: string): Task[] => getSortedTasks(getTasksByTag(tag), nameSortState),
    },
  })

  return {
    allTags,
    createViews,
    isProjectSelected,
  }
}
