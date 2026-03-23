<script setup lang="ts">
  import Tooltip from '@components/shared/Tooltip.vue'
  import { NFormItem, NInput, NSelect, type SelectOption } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  import type { Task } from '@/types/Task'

  const { tableGroupOptions, tagOptions } = defineProps<{
    tableGroupOptions: SelectOption[]
    tagOptions: SelectOption[]
  }>()

  const { t } = useI18n()
  const formData = defineModel<Task>('formData', { required: true })

  const handleSetTableGroup = (value: string | null): void => {
    formData.value.tableGroup = value
    // If the tags are empty, add the selected tableGroup as a tag
    if (formData.value.tags.length <= 0 && value) formData.value.tags.push(value)
  }
</script>

<template>
  <div class="flex-1">
    <n-form-item path="tableGroup">
      <template #label>
        <div class="flex items-center gap-1">
          {{ t('form.group') }}
          <Tooltip :text="t('form.groupTooltip')" small />
        </div>
      </template>
      <n-select
        :value="formData.tableGroup"
        :options="tableGroupOptions"
        placeholder=""
        filterable
        tag
        clearable
        class="shadow"
        @update:value="handleSetTableGroup"
      />
    </n-form-item>

    <n-form-item :label="t('form.tags')" path="tags">
      <n-select
        v-model:value="formData.tags"
        :options="tagOptions"
        placeholder=""
        filterable
        multiple
        tag
        clearable
        class="shadow"
      />
    </n-form-item>

    <n-form-item :label="t('form.description')" path="description">
      <n-input
        v-model:value="formData.description"
        type="textarea"
        class="shadow"
        placeholder=""
        :rows="4"
        clearable
      />
    </n-form-item>
  </div>
</template>
