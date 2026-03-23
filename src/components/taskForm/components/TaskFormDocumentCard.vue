<script setup lang="ts">
  import {
    CheckmarkDoneOutline,
    CloseOutline,
    DownloadOutline,
    PencilOutline,
    TrashOutline,
    WarningOutline,
  } from '@vicons/ionicons5'
  import {
    ImageRenderToolbarProps,
    NButton,
    NCard,
    NIcon,
    NImage,
    NInput,
    NModal,
    NText,
    useDialog,
    useMessage,
  } from 'naive-ui'

  import { readFile } from '@tauri-apps/plugin-fs'

  import { computed, h, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { TaskDocument } from '@/types/TaskDocument'
  import {
    checkDocumentAvailability,
    getFileIcon,
    isBlobDocumentPath,
    isImageFile,
    resolveFsPath,
    triggerBlobDownload,
  } from '@/utils/fileUtils'

  const dialog = useDialog()
  const message = useMessage()
  const document = defineModel<TaskDocument>({ required: true })
  const props = defineProps<{
    documentPath: string | null
  }>()

  const documentPath = computed(() => props.documentPath)

  const newName = ref(document.value.name)
  const isEditingName = ref(false)
  const isNewNameEmpty = computed(() => newName.value.trim() === '')
  const isDocumentError = ref(false)

  const emit = defineEmits<{
    (e: 'deleteDocument'): void
  }>()

  const { t } = useI18n()

  const documentFileName = computed(() => `${document.value.name}.${document.value.extension}`)
  const isImageDocument = computed(() => isImageFile(document.value.extension))
  const isPdfDocument = computed(() => document.value.extension.toLowerCase() === 'pdf')
  const hasDocumentPath = computed(() => Boolean(documentPath.value))
  const isDownloadDisabled = computed(() => !hasDocumentPath.value || isDocumentError.value)
  const showPdfPreview = ref(false)

  const canOpenPdfPreview = computed(
    () => isPdfDocument.value && hasDocumentPath.value && !isDocumentError.value,
  )

  const saveNewName = (): void => {
    if (isNewNameEmpty.value) return
    document.value.name = newName.value.trim()
    isEditingName.value = false
  }

  const cancelEditName = (): void => {
    newName.value = document.value.name
    isEditingName.value = false
  }

  const deleteDocument = (): void => {
    dialog.warning({
      title: t('dialogs.deleteDocumentTitle'),
      content: t('dialogs.deleteDocument', { name: document.value.name }),
      positiveText: t('dialogs.delete'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        emit('deleteDocument')
      },
    })
  }

  watch(
    documentPath,
    async (path) => {
      const isAvailable = await checkDocumentAvailability(path)
      isDocumentError.value = !isAvailable
    },
    { immediate: true },
  )

  const downloadDocument = async (): Promise<void> => {
    if (!hasDocumentPath.value && !document.value.file) {
      isDocumentError.value = true
      message.error(t('messages.documentUnavailable'))
      return
    }

    try {
      if (isBlobDocumentPath(documentPath.value as string)) {
        const blobSource = document.value.file
          ? document.value.file
          : await fetch(documentPath.value as string).then((response) => response.blob())
        triggerBlobDownload(blobSource, documentFileName.value)
        message.success(t('messages.documentDownloadSuccess', { name: documentFileName.value }))
        return
      }

      const fsPath = resolveFsPath(documentPath.value as string)
      if (!fsPath) throw new Error('Invalid document path')

      const data = await readFile(fsPath)
      triggerBlobDownload(new Blob([data]), documentFileName.value)
      message.success(t('messages.documentDownloadSuccess', { name: documentFileName.value }))
    } catch (error) {
      console.error('Failed to download document', error)
      message.error(t('messages.documentDownloadError', { name: documentFileName.value }))
    }
  }

  function renderToolbar({ nodes }: ImageRenderToolbarProps) {
    return [
      nodes.rotateCounterclockwise,
      nodes.rotateClockwise,
      nodes.zoomIn,
      nodes.zoomOut,
      h(
        NIcon,
        {
          style: { marginLeft: '10px', marginBottom: '4px', marginRight: '6px' },
          size: '24px',
          class: 'cursor-pointer',
          onClick: () => {
            void downloadDocument()
          },
        },
        {
          default: () => h(DownloadOutline),
        },
      ),
      nodes.close,
    ]
  }

  const openPdfPreview = (): void => {
    if (!canOpenPdfPreview.value) return
    showPdfPreview.value = true
  }
</script>

<template>
  <div class="document-card shadow border border-gray-200 rounded-lg">
    <NCard size="small" :content-style="{ padding: '16px' }">
      <!-- Preview -->
      <div
        class="h-[200px] max-w-[320px] mb-2 shadow-sm hover:border hover:rounded border-gray-300"
      >
        <div
          v-if="isDocumentError"
          class="flex flex-col gap-2 h-full items-center justify-center rounded border border-dashed border-red-200 bg-red-50 px-4 text-center"
        >
          <NIcon size="32" class="me-2" :component="WarningOutline" />
          <NText type="error" class="font-semibold">
            {{ t('messages.documentUnavailable') }}
          </NText>
        </div>
        <div
          v-else-if="isPdfDocument"
          class="relative flex justify-center flex-col items-center opacity-80 h-full w-[200px]"
          :class="{ 'cursor-pointer hover:opacity-100': canOpenPdfPreview }"
          @click="openPdfPreview"
        >
          <NIcon size="120" :component="getFileIcon(document.extension)" color="#f5051c" />
          <div class="absolute top-5 right-5 font-bold text-sm text-[#f5051c]">PDF</div>
        </div>
        <n-image
          v-else-if="isImageDocument && documentPath"
          :src="documentPath"
          :alt="document.name"
          object-fit="contain"
          :show-toolbar="true"
          :render-toolbar="renderToolbar"
        />
        <div v-else class="flex justify-center items-center opacity-80 h-full w-[200px]">
          <NIcon size="120" :component="getFileIcon(document.extension)" />
        </div>
      </div>

      <NModal
        v-model:show="showPdfPreview"
        preset="card"
        style="width: min(92vw, 1100px)"
        :title="documentFileName"
        :bordered="false"
      >
        <iframe
          v-if="isPdfDocument && documentPath"
          :src="documentPath"
          class="w-full h-[80vh]"
          :title="documentFileName"
        />
      </NModal>

      <!-- Document info -->
      <div class="document-info">
        <div v-if="isEditingName" class="flex justify-between items-center gap-2">
          <NInput
            v-model:value="newName"
            :placeholder="t('form.documentName')"
            :status="isNewNameEmpty ? 'error' : 'success'"
          />
          <NButton
            class="ms-5"
            size="small"
            circle
            type="success"
            :title="t('form.saveDocumentName')"
            :disabled="isNewNameEmpty"
            @click="saveNewName"
          >
            <template #icon>
              <NIcon>
                <CheckmarkDoneOutline />
              </NIcon>
            </template>
          </NButton>
          <NButton
            size="small"
            circle
            type="error"
            :title="t('form.cancelEditDocumentName')"
            @click="cancelEditName"
          >
            <template #icon>
              <NIcon>
                <CloseOutline />
              </NIcon>
            </template>
          </NButton>
        </div>
        <div v-else class="flex justify-between items-center gap-6">
          <NText class="document-name font-semibold text-[16px]" :title="document.name">
            {{ document.name }}
          </NText>
          <NButton
            size="small"
            circle
            type="warning"
            :title="t('form.editDocumentName')"
            @click="isEditingName = true"
          >
            <template #icon>
              <NIcon>
                <PencilOutline />
              </NIcon>
            </template>
          </NButton>
        </div>

        <NText class="opacity-80 font-semibold" :title="document.name">
          .{{ document.extension }}
        </NText>
      </div>

      <!-- Actions -->
      <div class="flex justify-between gap-2 mt-4">
        <NButton
          size="small"
          circle
          type="primary"
          :disabled="isDownloadDisabled"
          :title="t('form.downloadDocument')"
          @click="downloadDocument"
        >
          <template #icon>
            <NIcon>
              <DownloadOutline />
            </NIcon>
          </template>
        </NButton>
        <NButton
          size="small"
          circle
          type="error"
          :title="t('form.deleteDocument')"
          @click="deleteDocument"
        >
          <template #icon>
            <NIcon>
              <TrashOutline />
            </NIcon>
          </template>
        </NButton>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
  .document-card {
    transition: all 0.2s ease;
  }

  .document-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .document-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 44px;
  }

  .document-path {
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
