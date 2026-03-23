import type { VNode } from 'vue'

import type { Task } from '@/types/Task'
import type { TaskColumn } from '@/types/TaskColumn'

export function getCellContent(column: TaskColumn, row: Task, rowIndex: number): string | VNode {
  if (column.render) {
    const result = column.render(row, rowIndex)
    if (typeof result === 'object' && result !== null && '__v_isVNode' in result)
      return result as VNode

    return String(result)
  }
  const value = row[column.key as keyof Task]
  return value !== null ? String(value) : '-'
}

export function sortTasksByDefault(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.project === b.project)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

    return a.project.localeCompare(b.project)
  })
}
