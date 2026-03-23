import { Spending } from '@/types/Task'

export type TaskList = {
  id: TaskListKey
  label: string
  categories: string[]
  hiddenColumnKeys: string[]
  enableSorting: boolean
  showFilter: boolean
  getTasks: (filterVal: string) => Spending[]
}
export type TaskListKey = 'allInOne' | 'byTags'
