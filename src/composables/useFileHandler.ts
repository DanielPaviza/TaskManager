import { useMessage } from 'naive-ui'

import { invoke } from '@tauri-apps/api/core'
import { convertFileSrc } from '@tauri-apps/api/core'
import { join } from '@tauri-apps/api/path'
import { mkdir, remove, writeFile } from '@tauri-apps/plugin-fs'

import { ref } from 'vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { DOCUMENTS_FOLDER_NAME } from '@/constants/documentFolder'
import { TaskDocument } from '@/types/TaskDocument'

/**
 * Composable for managing file uploads to the Documents folder
 */
export function useFileHandler() {
  const message = useMessage()
  const documentDirectoryExists = ref(false)
  const documentsFolderPath = ref<string | null>(null)
  const { t } = useI18n()

  onMounted(async () => {
    documentsFolderPath.value = await getDocumentsFolderPath()
    documentDirectoryExists.value = await ensureDocumentsDirectory()
  })

  /**
   * Ensures the Documents directory exists next to the database file
   */
  async function ensureDocumentsDirectory(): Promise<boolean> {
    if (!documentsFolderPath.value) {
      console.error('Documents folder path is not set.')
      return false
    }

    try {
      // Create Documents folder
      await mkdir(documentsFolderPath.value, {
        recursive: true,
      })

      return true
    } catch (error) {
      console.error('Failed to create Documents directory:', error)
      return false
    }
  }

  /**
   * Copy file from its original location to the Documents folder
   * @param fileToUpload File to upload with its document metadata
   * @returns Promise resolving to true if upload was successful
   */
  async function uploadFile(fileToUpload: TaskDocument, newName: string): Promise<boolean> {
    const documentDisplayName = `${fileToUpload.name}.${fileToUpload.extension}`

    if (!documentsFolderPath.value || !documentDirectoryExists.value || !fileToUpload.file) {
      message.error(
        t('messages.documentUploadError', {
          name: documentDisplayName,
        }),
        { duration: 6000 },
      )
      return false
    }

    try {
      // Destination path in Documents folder
      const destPath = await getDocumentFullPath(`${newName}.${fileToUpload.extension}`)

      const arrayBuffer = await fileToUpload.file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      await writeFile(destPath, uint8Array)

      return true
    } catch (error) {
      message.error(
        t('messages.documentUploadError', {
          name: documentDisplayName,
        }),
      )
      console.error('Failed to upload file:', error)
      return false
    }
  }

  async function deleteFile(fileToDelete: TaskDocument): Promise<boolean> {
    const documentDisplayName = `${fileToDelete.name}.${fileToDelete.extension}`

    if (!documentsFolderPath.value) {
      console.error('Failed to delete file. Documents folder path is not set.')
      message.error(t('messages.documentDeleteError', { name: documentDisplayName }))
      return false
    }

    try {
      const filePath = await getDocumentFullPath(fileToDelete.path)
      await remove(filePath)

      return true
    } catch (error) {
      console.error('Failed to delete file:', error)
      message.error(t('messages.documentDeleteError', { name: documentDisplayName }))
      return false
    }
  }

  async function getDocumentFullPath(documentName: string): Promise<string> {
    if (!documentsFolderPath.value) throw new Error('Documents folder path is not set.')

    try {
      return await join(documentsFolderPath.value, documentName)
    } catch (error) {
      console.error('Failed to get document full path:', error)
      throw error
    }
  }

  /**
   * Get the full path to the Documents folder
   */
  async function getDocumentsFolderPath(): Promise<string | null> {
    try {
      const baseDir = await invoke<string>('get_app_data_dir')
      return await join(baseDir, DOCUMENTS_FOLDER_NAME)
    } catch (error) {
      console.error('Failed to get Documents folder path:', error)
      return null
    }
  }

  const convertDocumentPath = (documentName: string): string | null => {
    if (!documentsFolderPath.value) return null
    return convertFileSrc(`${documentsFolderPath.value}/${documentName}`)
  }

  return {
    uploadFile,
    deleteFile,
    convertDocumentPath,
  }
}
