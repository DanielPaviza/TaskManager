import { Ref, ref } from 'vue'

import { TaskDocument } from '@/types/TaskDocument'
import { getFileBlobUrl, getFileExtension, getFileName } from '@/utils/fileUtils'

/**
 * Composable for handling drag and drop file operations
 */
export function useDocumentsDragDrop(pendingDocuments: Ref<TaskDocument[]>) {
  const isDragging = ref(false)

  /**
   * Add files to the documents array and track File objects for upload
   */
  async function addFiles(files: FileList): Promise<void> {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const blobUrl = await getFileBlobUrl(file)
      const document: TaskDocument = {
        name: getFileName(file.name),
        extension: getFileExtension(file.name),
        path: blobUrl,
        file: file, // Store the actual File object for upload
      }

      // Store the File object for later upload
      pendingDocuments.value.push(document)
    }
  }

  /**
   * Handle drag over event
   */
  function handleDragOver(event: DragEvent): void {
    event.preventDefault()
    isDragging.value = true
  }

  /**
   * Handle drag leave event
   */
  function handleDragLeave(): void {
    isDragging.value = false
  }

  /**
   * Handle drop event
   */
  async function handleDrop(event: DragEvent): Promise<void> {
    event.preventDefault()
    isDragging.value = false

    const files = event.dataTransfer?.files
    if (files) await addFiles(files)
  }

  /**
   * Handle file input change event
   */
  async function handleFileSelect(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement
    const files = input.files
    if (files) {
      await addFiles(files)
      // Reset input to allow selecting the same file again
      input.value = ''
    }
  }

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
  }
}
