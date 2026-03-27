<script setup lang="ts">
  import { useSettingsStore } from '@stores/settingsStore'
  import { useMessage } from 'naive-ui'
  import { NDrawer, NDrawerContent, NForm, NFormItem, NSelect } from 'naive-ui'

  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import FormActions from '@/components/shared/FormActions.vue'
  import SelectBool from '@/components/shared/SelectBool.vue'
  import SelectTextNull from '@/components/shared/SelectTextNull.vue'
  import tooltip from '@/components/shared/Tooltip.vue'
  import { useTasksColumns } from '@/composables/task/useTasksColumns'
  import { useSettingsFormValidation } from '@/composables/useSettingsFormValidation'
  import { DEFAULT_SETTINGS } from '@/constants/defaultSettings'
  import { LANGUAGES } from '@/constants/languages'
  import { SUMMARY_SLIDES } from '@/constants/summaryCards'
  import { useTasksStore } from '@/stores/tasksStore'
  import { Settings } from '@/types/Settings'

  const { t } = useI18n()
  const { columns } = useTasksColumns()
  const { settings, save: saveSettings } = useSettingsStore()
  const { projects } = useTasksStore()
  const tempSettings = ref<Settings>({ ...settings })

  const router = useRouter()
  const message = useMessage()
  const { rules } = useSettingsFormValidation()

  const isOpen = ref(false)
  onMounted(() => (isOpen.value = true))

  function closeDrawer(): void {
    router.push('/')
  }

  const handleSave = async (): Promise<void> => {
    const success = await saveSettings(tempSettings.value)
    if (success) {
      message.success(t('messages.settingsSavedSuccessfully'))
      closeDrawer()
    } else message.error(t('messages.errorSavingSettings'))
  }

  const handleReset = (): void => {
    tempSettings.value = { ...DEFAULT_SETTINGS }
  }

  const isDefaultHiddenColumnsValid = computed(
    (): boolean => tempSettings.value.defaultHiddenTaskColumns.length < columns.value.length,
  )
</script>

<template>
  <n-drawer :show="isOpen" width="40%" placement="right" @update:show="closeDrawer">
    <div class="backdrop-blur fixed left-0 w-screen h-screen -z-10 opacity-100"></div>
    <n-drawer-content closable class="p-4 z-50">
      <template #header>
        <div class="text-2xl font-bold text-blue">{{ t('settings.title') }}</div>
      </template>
      <n-form
        ref="formRef"
        :model="tempSettings"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('settings.language')" path="languageCode">
          <n-select
            v-model:value="tempSettings.languageCode"
            :options="LANGUAGES.map((lang) => ({ label: lang.name, value: lang.code }))"
          />
        </n-form-item>

        <n-form-item class="flex items-center">
          <template #label>
            <div class="flex items-center">
              <span>{{ t('settings.tableGroupDefaultState') }}</span>
              <div class="ms-2">
                <tooltip :text="t('settings.tableGroupDefaultStateTooltip')" />
              </div>
            </div>
          </template>
          <SelectBool v-model:value="tempSettings.tableGroupDefaultOpen" />
        </n-form-item>

        <n-form-item path="defaultSummaryCard">
          <template #label>
            <div class="flex items-center">
              <span>{{ t('settings.summaryCardDefault') }}</span>
              <div class="ms-2"><tooltip :text="t('settings.summaryCardDefaultTooltip')" /></div>
            </div>
          </template>
          <n-select
            v-model:value="tempSettings.defaultSummaryCard"
            :options="SUMMARY_SLIDES.map((slide) => ({ label: t(slide.title), value: slide.id }))"
          />
        </n-form-item>

        <n-form-item path="defaultProjectView">
          <template #label>
            <div class="flex items-center">
              <span>{{ t('settings.projectViewDefault') }}</span>
              <div class="ms-2"><tooltip :text="t('settings.projectViewDefaultTooltip')" /></div>
            </div>
          </template>
          <SelectTextNull
            v-model:value="tempSettings.defaultProjectView"
            :options="projects"
            :null-item-label="$t('common.allProjects')"
          />
        </n-form-item>

        <n-form-item path="defaultHiddenTaskColumns">
          <template #label>
            <div class="flex items-center">
              <span>{{ t('settings.hiddenTaskColumnsDefault') }}</span>
              <div class="ms-2">
                <tooltip :text="t('settings.hiddenTaskColumnsDefaultTooltip')" />
              </div>
            </div>
          </template>
          <div class="flex flex-col w-full">
            <n-select
              v-model:value="tempSettings.defaultHiddenTaskColumns"
              :options="columns.map((column) => ({ label: column.title, value: column.key }))"
              :placeholder="t('form.selectTags')"
              filterable
              multiple
              tag
              clearable
              :status="isDefaultHiddenColumnsValid ? 'success' : 'error'"
            />
            <div v-if="!isDefaultHiddenColumnsValid" class="text-red-500 text-sm mt-1">
              {{ t('settings.hiddenTaskColumnsValidation') }}
            </div>
          </div>
        </n-form-item>

        <n-form-item>
          <template #label>
            <div class="flex items-center">
              <span>{{ t('settings.showDashboard') }}</span>
              <div class="ms-2">
                <tooltip :text="t('settings.showDashboardTooltip')" />
              </div>
            </div>
          </template>
          <SelectBool v-model:value="tempSettings.showDashboard" />
        </n-form-item>
      </n-form>

      <template #footer>
        <FormActions
          show-reset
          :save-text="t('form.saveChangesButton')"
          :can-save="isDefaultHiddenColumnsValid"
          @save="handleSave"
          @cancel="closeDrawer"
          @reset="handleReset"
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
