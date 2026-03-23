import { VNodeChild } from 'vue'

import { Task } from '@/types/Task'

export interface ActionContextItem {
  label?: string
  key: string
  icon: () => VNodeChild
  handleTaskAction?: (task: Task) => void | Promise<void>
  handleAction?: () => void | Promise<void>
}
