<script setup lang="ts">
  import { ArrowForward } from '@vicons/ionicons5'
  import {
    NDrawer,
    NDrawerContent,
    NForm,
    NFormItem,
    NIcon,
    NInput,
    useDialog,
    useMessage,
  } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  import ButtonNavigation from '@/components/shared/ButtonNavigation.vue'
  import FormActions from '@/components/shared/FormActions.vue'
  import Tooltip from '@/components/shared/Tooltip.vue'
  import { useTasksStore } from '@/stores/tasksStore'
  import { BulkEditProps } from '@/types/BulkEditProps'

  const { t } = useI18n()
  const router = useRouter()
  const message = useMessage()
  const dialog = useDialog()
  const route = useRoute()
  const { projectView } = storeToRefs(useTasksStore())

  const { props } = defineProps<{
    props: BulkEditProps
  }>()

  const name = route.params.name as string
  const newName = ref<string>(name)
  const isNameEdited = computed(() => newName.value !== name)

  const isNewNameValid = computed(() => newName.value.trim().length > 0)

  // Best-practice: single source of truth for scope choices
  const scopeChoices = computed(() => [
    {
      id: 'current-project',
      label: t('spendingBulkEditForm.currentProject', { name: projectView.value }),
    },
    {
      id: 'all-projects',
      label: t('spendingBulkEditForm.allProjects'),
      selectedColor: 'orange',
      colorHover: 'orange',
    },
  ])

  const selectedScope = ref<string>('current-project')
  const isAllProjects = computed(() => selectedScope.value === 'all-projects')

  const deleteDialog = async (): Promise<void> => {
    dialog.error({
      title: props.deleteDialogTitle,
      content: props.deleteDialogContentText,
      positiveText: t('dialogs.delete'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        props.removeTaskBulk(isAllProjects.value)
        closeDrawer()
        message.success(props.deleteDialogSuccessMessage)
      },
    })
  }

  const isOpen = ref(false)
  onMounted(() => (isOpen.value = true))

  function closeDrawer(): void {
    router.push('/')
  }

  async function handleSave(): Promise<void> {
    if (!isNewNameValid.value) {
      message.warning(t('messages.nameCannotBeEmpty'))
      return
    }

    if (!isNameEdited.value) {
      closeDrawer()
      return
    }
    try {
      props.renameTaskProperty(newName.value, isAllProjects.value)
      message.success(props.renameSuccessText)
      closeDrawer()
    } catch (error) {
      console.error('Error while saving task property rename', error)
      message.error(props.renameErrorText)
    }
  }
</script>

<template>
  <n-drawer :show="isOpen" width="40%" placement="right" @update:show="closeDrawer">
    <div class="backdrop-blur fixed left-0 w-screen h-screen -z-10 opacity-100"></div>

    <n-drawer-content closable class="p-4">
      <template #header>
        <div class="text-2xl font-bold text-blue">
          {{ props.title }}
        </div>
      </template>
      <n-form label-placement="top" require-mark-placement="right-hanging">
        <n-form-item v-if="props.canSelectScope" path="scope">
          <template #label>
            <div class="flex items-center">
              <span>{{ $t('spendingBulkEditForm.scopeLabel') }}</span>
              <div class="ms-2">
                <tooltip :text="$t('spendingBulkEditForm.scopeInputTooltip')" />
              </div>
            </div>
          </template>
          <div class="flex justify-center w-full">
            <ButtonNavigation v-model:selected-id="selectedScope" full :buttons="scopeChoices" />
          </div>
        </n-form-item>
        <n-form-item path="name">
          <template #label>
            <div class="flex items-center">
              <span>{{ props.nameLabel }}</span>
              <div class="ms-2">
                <tooltip :text="props.nameInputTooltip" />
              </div>
            </div>
          </template>
          <div class="flex flex-col w-full">
            <n-input v-model:value="newName" :placeholder="props.nameLabel" />
            <div v-if="!isNewNameValid" class="text-sm text-red-500 mt-1 ms-1">
              {{ $t('messages.nameCannotBeEmpty') }}
            </div>
          </div>
        </n-form-item>
        <div v-if="isNameEdited && isNewNameValid">
          <div class="text-lg font-semibold">{{ $t('common.rename') }}</div>
          <div
            class="text-lg flex justify-center items-center p-3 rounded bg-blue-50 text-blue-800 mt-1"
          >
            {{ name }}
            <n-icon size="20" class="mx-3 mt-0.5">
              <ArrowForward />
            </n-icon>
            <strong>{{ newName }}</strong>
          </div>
        </div>
      </n-form>

      <template #footer>
        <FormActions
          show-delete
          :save-text="t('form.saveChangesButton')"
          :can-save="isNewNameValid"
          @save="handleSave"
          @delete="deleteDialog"
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
