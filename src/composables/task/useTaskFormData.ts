import { ComputedRef, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { TASK_FORM_DATA_DEFAULT } from '@/constants/spendingFormData'
import { useTasksStore } from '@/stores/tasksStore'
import { Task } from '@/types/Task'
import { createTask } from '@/utils/taskFactory'

export function useTaskFormData() {
  const store = useTasksStore()
  const route = useRoute()

  const isEditMode = computed(() => route.path.startsWith('/edit/'))

  const currentTask: ComputedRef<Task | null> = computed(() => {
    if (isEditMode.value) {
      const id = route.params.id as string
      return store.tasks.find((s) => s.id === id) || null
    }
    return null
  })

  const formData = ref<Task>(createTask(TASK_FORM_DATA_DEFAULT))

  // Watch for changes to the current task to populate form
  watch(
    currentTask,
    (newTask) => {
      // edit task form
      if (newTask !== null) {
        formData.value = createTask(newTask)
        return
      }

      // Check for template task for new form
      const templateTask = store.tasks.find((s) => s.id === (route.query.template as string))

      // If no template found, use default new task with selected project
      if (!templateTask) {
        const defaultData: Partial<Task> = {
          ...TASK_FORM_DATA_DEFAULT,
          // Set project to selected project view if one is selected
          project: store.projectView ?? '',
        }
        formData.value = createTask(defaultData)
        return
      }

      // New form data prefilled from template
      const sanitizedTemplate: Partial<Task> = {
        ...templateTask,
        id: '',
        createdAt: new Date(),
        editedAt: null,
        documents: [],
      }
      formData.value = createTask(sanitizedTemplate)
    },
    { immediate: true },
  )

  // Convert Date to timestamp for date picker
  const createdAtTimestamp = computed({
    get: () => formData.value.createdAt.getTime(),
    set: (value: number) => {
      formData.value.createdAt = new Date(value)
    },
  })

  return {
    formData,
    currentTask,
    isEditMode,
    createdAtTimestamp,
  }
}
