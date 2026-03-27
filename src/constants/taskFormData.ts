import { Priority } from '@/constants/Priority'
import { Task } from '@/types/Task'
import { TaskDocument } from '@/types/TaskDocument'

export const TASK_FORM_DATA_DEFAULT: Partial<Task> = {
  project: '',
  name: '',
  state: 'doing',
  priority: Priority.p2,
  description: '',
  tableGroup: '',
  tags: [] as string[],
  createdAt: new Date(),
  documents: [] as TaskDocument[],
}
