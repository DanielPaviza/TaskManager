import { invoke } from '@tauri-apps/api/core'
import type { CloseRequestedEvent, Window } from '@tauri-apps/api/window'

import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useTasksStore } from '@/stores/tasksStore'

export function useOnAppCloseActions(): void {
  const { t } = useI18n()
  const store = useTasksStore()
  const appWindow = ref<Window | null>(null)
  const closeRequestUnlisten = ref<(() => void) | null>(null)

  const backupData = async (): Promise<void> => {
    try {
      await invoke('save_data_backup')
    } catch (error) {
      console.error('Failed to back up data before closing:', error)
    }
  }

  const unsavedChangesDialog = async (event: CloseRequestedEvent): Promise<void> => {
    if (!store.pendingChanges) return

    event.preventDefault()
    const { ask } = await import('@tauri-apps/plugin-dialog')
    const shouldClose = await ask(t('dialogs.unsavedChangesContent'), {
      title: t('dialogs.unsavedChangesTitle'),
      kind: 'warning',
      okLabel: t('dialogs.closeWithoutSaving'),
      cancelLabel: t('common.cancel'),
    })

    if (shouldClose)
      try {
        await appWindow.value?.destroy()
      } catch (e) {
        console.error('Error closing window:', e)
      }
  }

  onMounted(async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    appWindow.value = getCurrentWindow()

    closeRequestUnlisten.value = await appWindow.value.onCloseRequested(async (event) => {
      await unsavedChangesDialog(event)
      await backupData()
    })
  })

  // Cleanup on unmount
  onBeforeUnmount(() => {
    closeRequestUnlisten.value?.()
    closeRequestUnlisten.value = null
  })
}
