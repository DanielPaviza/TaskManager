import { TaskDocument } from '@/types/TaskDocument'

export interface Task {
  id: string
  project: string
  name: string
  state: 'todo' | 'doing' | 'done'
  severity: 'low' | 'medium' | 'high'
  description?: string | null
  tableGroup?: string | null
  tags: string[]
  createdAt: Date
  editedAt: Date | null
  documents: TaskDocument[]
}
