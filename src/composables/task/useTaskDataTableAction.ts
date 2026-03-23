import { BuildOutline, Copy, RemoveCircleOutline } from '@vicons/ionicons5'

import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { useTaskDialogAction } from '@/composables/task/useTaskDialogAction'
import { type ActionContextItem } from '@/types/ActionContextItem'
import { Task } from '@/types/Task'
import { renderIcon } from '@/utils/iconUtils'

export function useTaskDataTableAction() {
  const { t } = useI18n()
  const { deleteDialog } = useTaskDialogAction()
  const router = useRouter()

  const actionOptions: ActionContextItem[] = [
    {
      label: t('actions.delete'),
      key: 'deleteTask',
      icon: renderIcon(RemoveCircleOutline, 'red'),
      handleTaskAction: (task: Task): Promise<void> => deleteDialog(task, null),
    },
    {
      label: t('actions.copy'),
      key: 'copyTask',
      icon: renderIcon(Copy, 'green'),
      handleTaskAction: (task: Task): void => handleGotoCopyNewTask(task),
    },
    {
      label: t('actions.edit'),
      key: 'editTask',
      icon: renderIcon(BuildOutline, 'orange'),
      handleTaskAction: (task: Task): void => handleGotoEditTask(task),
    },
  ]

  const handleActionSelect = (actionKey: string, task: Task): void => {
    const selectedAction = actionOptions.find((option) => option.key === actionKey)
    if (!selectedAction) return
    selectedAction.handleTaskAction!(task)
  }

  function handleGotoEditTask(task: Task): void {
    router.push(`/edit/${task.id}`)
  }

  function handleGotoCopyNewTask(task: Task): void {
    router.push({ path: '/new', query: { template: task.id } })
  }

  return {
    actionOptions,
    handleActionSelect,
  }
}
