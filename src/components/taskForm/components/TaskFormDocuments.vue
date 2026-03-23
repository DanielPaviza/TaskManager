<script setup lang="ts">
  import { AddOutline, DocumentAttachOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import FormDocumentCard from '@/components/taskForm/components/TaskFormDocumentCard.vue'
  import { useDocumentsDragDrop } from '@/composables/useDocumentsDragDrop'
  import { useFileHandler } from '@/composables/useFileHandler'
  import { TaskDocument } from '@/types/TaskDocument'

  const { convertDocumentPath } = useFileHandler()

  const documents = defineModel<TaskDocument[]>('documents', { required: true })

  const documentsToUpload = defineModel<TaskDocument[]>('documentsToUpload', {
    default: [],
  })
  const documentsToDelete = defineModel<TaskDocument[]>('documentsToDelete', {
    default: [],
  })

  const { t } = useI18n()
  const fileInputRef = ref<HTMLInputElement | null>(null)

  // Drag and drop functionality
  const { isDragging, handleDragOver, handleDragLeave, handleDrop, handleFileSelect } =
    useDocumentsDragDrop(documentsToUpload)

  // Trigger file input click
  function openFilePicker(event?: Event): void {
    event?.stopPropagation()
    fileInputRef.value?.click()
  }

  const deleteDocument = (index: number): void => {
    documentsToDelete.value.push(documents.value[index])
    documents.value.splice(index, 1)
  }

  const deleteNewDocument = (index: number): void => {
    documentsToUpload.value.splice(index, 1)
  }
</script>

<template>
  <!-- Hidden file input -->
  <input
    ref="fileInputRef"
    type="file"
    multiple
    accept="*/*"
    class="hidden"
    @change="handleFileSelect"
  />
  <div
    class="drop-zone p-6 rounded-lg border-dashed border-2 border-gray-300"
    :class="{ 'drop-zone-active': isDragging }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="flex items-center justify-between mb-5">
      <span class="text-lg font-medium text-gray-700">{{ t('form.documents') }}</span>
      <NButton color="#3b82f6" size="small" type="primary" @click.stop="openFilePicker">
        <template #icon>
          <NIcon>
            <AddOutline />
          </NIcon>
        </template>
      </NButton>
    </div>

    <div class="flex gap-4 flex-wrap">
      <FormDocumentCard
        v-for="(_doc, index) in documents"
        :key="`document-${index}`"
        v-model="documents[index]"
        :document-path="convertDocumentPath(documents[index].path)"
        @delete-document="deleteDocument(index)"
      />
      <FormDocumentCard
        v-for="(_doc, index) in documentsToUpload"
        :key="`new-document-${index}`"
        v-model="documentsToUpload[index]"
        :document-path="documentsToUpload[index].path"
        @delete-document="deleteNewDocument(index)"
      />
      <div
        class="flex flex-col relative justify-center items-center border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:shadow-lg rounded-lg p-8 shadow cursor-pointer"
        @click="openFilePicker"
      >
        <NIcon size="124" :component="DocumentAttachOutline" class="text-gray-400 mb-2" />
        <div class="text-sm font-semibold text-gray-500">{{ t('form.addDocument') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .drop-zone {
    transition: all 0.3s ease;
  }

  .drop-zone-active {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }
</style>
