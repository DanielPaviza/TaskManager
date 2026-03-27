import { reactive } from 'vue'

import type { Task } from '@/types/Task'

export function createTask(data?: Partial<Task>): Task {
  const now = new Date()

  return reactive({
    id: data?.id ? data.id : crypto.randomUUID(),
    project: data?.project ?? '',
    name: data?.name ?? '',
    state: data?.state ?? 'todo',
    priority: data?.priority ?? 'medium',
    description: data?.description ?? null,
    tableGroup: data?.tableGroup ?? null,
    tags: data?.tags ?? [],
    createdAt: data?.createdAt ? new Date(data.createdAt) : now,
    editedAt: data?.editedAt ? new Date(data.editedAt) : null,

    documents: data?.documents
      ? data.documents.map((doc) => ({
          ...doc,
        }))
      : [],
  }) as Task
}
