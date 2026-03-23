import { useDialog, useMessage } from 'naive-ui'

import { useI18n } from 'vue-i18n'

import { useTasksStore } from '@/stores/tasksStore'

export function useTaskDialogAction() {
  const { t } = useI18n()
  const dialog = useDialog()
  const message = useMessage()
  const store = useTasksStore()

  const deleteDialog = async (
    data: { name: string; id: string },
    event: Event | null,
    onPositiveAction?: () => void,
  ): Promise<void> => {
    event?.stopPropagation()

    dialog.warning({
      title: t('dialogs.deleteTaskTitle'),
      content: t('dialogs.deleteTaskContent', { name: data.name }),
      positiveText: t('dialogs.delete'),
      negativeText: t('common.cancel'),
      onPositiveClick: () => {
        store.removeTask(data.id)
        message.success(t('messages.taskDeletedSuccessfully'))
        onPositiveAction?.()
      },
    })
  }

  const discardChangesDialog = (): void => {
    dialog.warning({
      title: t('dialogs.discardChangesTitle'),
      content: t('dialogs.discardChangesContent'),
      positiveText: t('dialogs.discard'),
      negativeText: t('common.cancel'),
      onPositiveClick: () => {
        store.discardChanges()
        message.info(t('messages.changesDiscarded'))
      },
    })
  }

  const restoreAllChangesDialog = (totalCount: number): void => {
    dialog.warning({
      title: t('dialogs.restoreAllTitle'),
      content: t('dialogs.restoreAllContent', { count: totalCount }),
      positiveText: t('dialogs.restore'),
      negativeText: t('common.cancel'),
      onPositiveClick: () => {
        try {
          store.restoreAllDeletedTasks()
          message.success(t('messages.allDeletedItemsRestored'))
        } catch {
          message.error(t('messages.errorRestoringAllItems'))
        }
      },
    })
  }

  return {
    deleteDialog,
    discardChangesDialog,
    restoreAllChangesDialog,
  }
}
