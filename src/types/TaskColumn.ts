import { VNode } from 'vue'

import { Task } from '@/types/Task'

export interface TaskColumn {
  title: string
  key: keyof Task | string
  isHidden?: boolean
  filterEnabled?: boolean
  selectFilterEnabled?: boolean
  tooltip?: string | null
  sortFn?: (a: Task, b: Task) => number
  filterVal: (row: Task) => string
  render?: (row: Task, rowIndex: number) => VNode | string | number
}
