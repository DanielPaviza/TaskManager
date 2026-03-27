import { Priority } from '@/constants/taskPriority'
import { State } from '@/constants/taskState'
import { TaskDocument } from '@/types/TaskDocument'

export interface Task {
  id: string
  project: string
  name: string
  state: State
  priority: Priority
  description?: string | null
  tableGroup?: string | null
  tags: string[]
  createdAt: Date
  editedAt: Date | null
  documents: TaskDocument[]
}
