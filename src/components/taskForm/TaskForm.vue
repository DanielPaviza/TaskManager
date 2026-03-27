<script setup lang="ts">
  import { type FormInst, NDrawer, NDrawerContent, NForm, useMessage } from 'naive-ui'

  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import FormActions from '@/components/shared/FormActions.vue'
  import FormAdditionalFields from '@/components/taskForm/components/TaskFormAdditionalFields.vue'
  import FormBasicFields from '@/components/taskForm/components/TaskFormBasicFields.vue'
  import FormDocuments from '@/components/taskForm/components/TaskFormDocuments.vue'
  import { useTaskDialogAction } from '@/composables/task/useTaskDialogAction'
  import { useTaskFormData } from '@/composables/task/useTaskFormData'
  import { useTaskFormOptions } from '@/composables/task/useTaskFormOptions'
  import { useTaskFormValidation } from '@/composables/task/useTaskFormValidation'
  import { formatDateLocalized } from '@/composables/useDateFormat'
  import { useFileHandler } from '@/composables/useFileHandler'
  import { useTasksStore } from '@/stores/tasksStore'
  import { TaskDocument } from '@/types/TaskDocument'

  const { deleteDialog } = useTaskDialogAction()
  const { t } = useI18n()
  const store = useTasksStore()
  const formRef = ref<FormInst | null>(null)
  const router = useRouter()
  const message = useMessage()

  // File upload functionality
  const { uploadFile, deleteFile } = useFileHandler()

  const documentsToUpload = ref<TaskDocument[]>([])
  const documentsToDelete = ref<TaskDocument[]>([])

  const drawerTitle = computed(() => (isEditMode.value ? t('form.editTask') : t('form.newTask')))

  const { formData, currentTask, isEditMode } = useTaskFormData()
  const { rules } = useTaskFormValidation()
  const { projectOptions, tableGroupOptions, tagOptions } = useTaskFormOptions(
    computed(() => formData.value),
  )

  const isOpen = ref(false)
  onMounted(() => (isOpen.value = true))

  function closeDrawer(): void {
    router.push('/')
  }

  const uploadAllPendingDocuments = async (): Promise<void> => {
    await Promise.all(
      documentsToUpload.value.map(async (document) => {
        const copyName = crypto.randomUUID()
        const copySuccess = await uploadFile(document, copyName)
        if (copySuccess)
          // Update document path to the copied name and remove File object before saving
          formData.value.documents.push({
            name: document.name,
            extension: document.extension,
            path: `${copyName}.${document.extension}`,
          })
      }),
    )
    documentsToUpload.value = []
  }

  const deleteAllPendingDocuments = async (): Promise<void> => {
    await Promise.all(
      documentsToDelete.value.map(async (document) => {
        await deleteFile(document)
      }),
    )
    documentsToDelete.value = []
  }

  async function handleSave(): Promise<void> {
    try {
      await formRef.value?.validate()
    } catch (error) {
      console.error('Spending field validation failed', error)
      message.error(t('messages.errorRequiredData'))
      return
    }

    try {
      // Upload files if any are pending
      await uploadAllPendingDocuments()

      // Delete files if any are pending. No need to wait
      void deleteAllPendingDocuments()

      // Update existing
      if (isEditMode.value && currentTask.value) {
        const updatedTask = {
          ...formData.value,
          editedAt: new Date(),
        }

        store.updateTask(currentTask.value.id, updatedTask)
        message.success(t('messages.taskEditedSuccessfully'))
      } else {
        // Create new
        store.addTask(formData.value)
        message.success(t('messages.taskCreatedSuccessfully'))
      }

      closeDrawer()
    } catch (error) {
      console.error('Error while saving task', error)
      message.error(t('messages.errorSavingTask'))
    }
  }

  async function handleDelete(): Promise<void> {
    if (!currentTask.value) return
    await deleteDialog(currentTask.value, null, closeDrawer)
  }
</script>

<template>
  <n-drawer :show="isOpen" width="80%" placement="right" @update:show="closeDrawer">
    <div class="backdrop-blur fixed left-0 w-screen h-screen -z-10 opacity-100"></div>
    <n-drawer-content :title="drawerTitle" closable class="p-4">
      <template #header>
        <div class="text-2xl font-bold text-blue">
          {{ drawerTitle }}
        </div>
      </template>
      <n-form
        ref="formRef"
        :model="formData"
        ;
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <div v-if="currentTask" class="w-full flex justify-end items-center">
          <span class="font-semibold text-gray-700">{{ t('form.edited') }}:</span>
          <span class="ml-1 text-gray-600">{{
            currentTask.editedAt ? formatDateLocalized(currentTask.editedAt, 'long') : 'Nikdy'
          }}</span>
        </div>

        <div class="flex gap-10">
          <FormBasicFields
            v-model:form-data="formData"
            :project-options="projectOptions"
            :is-edit-mode="isEditMode"
          />
          <FormAdditionalFields
            v-model:form-data="formData"
            :table-group-options="tableGroupOptions"
            :tag-options="tagOptions"
          />
        </div>

        <FormDocuments
          v-model:documents="formData.documents"
          v-model:documents-to-upload="documentsToUpload"
          v-model:documents-to-delete="documentsToDelete"
        />
      </n-form>

      <template #footer>
        <FormActions
          show-delete
          :save-text="isEditMode ? t('form.saveChangesButton') : t('form.createTaskButton')"
          @save="handleSave"
          @delete="handleDelete"
          @cancel="closeDrawer"
        />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<style scoped>
  :deep(.n-base-close.n-base-close--absolute.n-drawer-header__close) {
    color: #c04141;
    font-size: larger;
    padding: 10px;
  }
  :deep(.n-base-clear__clear) {
    color: #c62828 !important;
  }
  :deep(.n-base-clear__clear:hover) {
    color: red !important;
  }
</style>
