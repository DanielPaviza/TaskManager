import { useTasksStore } from '@/stores/tasksStore'

export function useTaskStatus() {
  const store = useTasksStore()

  function getTaskStatus(id: string): 'new' | 'edited' | null {
    if (store.newTaskIds.has(id)) return 'new'

    if (store.editedTaskIds.has(id)) return 'edited'

    return null
  }

  return {
    getTaskStatus,
  }
}
