import { Priority } from '@/constants/taskPriority'

export const PRIORITY_COLORS: Record<number, string> = {
  [Priority[1]]: '#ef4444', // red   – highest urgency
  [Priority[2]]: '#f97316', // orange
  [Priority[3]]: '#22c55e', // green – lowest urgency
}

export const PRIORITY_CHART_COLORS: string[] = [
  PRIORITY_COLORS[1],
  PRIORITY_COLORS[2],
  PRIORITY_COLORS[3],
]

export function getPriorityColor(priority: number): string {
  return PRIORITY_COLORS[priority] ?? '#6b7280'
}
