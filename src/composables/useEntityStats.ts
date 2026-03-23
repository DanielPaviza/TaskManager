import { type ComputedRef, type Ref, computed } from 'vue'

import type { Task } from '@/types/Task'

export type SortType = 'alphabetical' | 'count-desc'

export interface EntityStat {
  name: string
  count: number
}

export interface EntityStatsOptions {
  tasks: ComputedRef<Task[]> | Ref<Task[]>
  entities: ComputedRef<string[]> | Ref<string[]>
  filterFn: (task: Task, entity: string) => boolean
  sortBy: Ref<SortType>
}

export function useEntityStats(options: EntityStatsOptions) {
  const { tasks, entities, filterFn, sortBy } = options

  const entityStats = computed<EntityStat[]>(() => {
    return entities.value.map((entity) => {
      const entityItems = tasks.value.filter((s: Task) => filterFn(s, entity))
      const count = entityItems.length

      const stat: EntityStat = {
        name: entity,
        count,
      }

      return stat
    })
  })

  const sortedStats = computed<EntityStat[]>(() => {
    const sorted = [...entityStats.value]
    switch (sortBy.value) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'count-desc':
        return sorted.sort((a, b) => b.count - a.count)
      default:
        return sorted
    }
  })

  return {
    entityStats,
    sortedStats,
  }
}
