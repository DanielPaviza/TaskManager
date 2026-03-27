import { Priority } from '@/constants/taskPriority'
import { Task } from '@/types/Task'
import { TaskDocument } from '@/types/TaskDocument'

import { State } from './taskState'

export const TASK_FORM_DATA_DEFAULT: Partial<Task> = {
  project: '',
  name: '',
  state: State.todo,
  priority: Priority[1],
  description: '',
  tableGroup: '',
  tags: [] as string[],
  createdAt: new Date(),
  documents: [] as TaskDocument[],
}
