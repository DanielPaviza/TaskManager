import { Task } from '@/types/Task'

export type TaskList = {
  id: TaskListKey
  label: string
  categories: string[]
  hiddenColumnKeys: string[]
  enableSorting: boolean
  showFilter: boolean
  getTasks: (filterVal: string) => Task[]
}
export type TaskListKey = 'allInOne' | 'byTags' | 'byPriority' | 'byState' | 'kanban'
