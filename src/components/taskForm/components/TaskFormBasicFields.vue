<script setup lang="ts">
  import { NDatePicker, NFormItem, NInput, NSelect, type SelectOption } from 'naive-ui'

  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { Task } from '@/types/Task'

  const { projectOptions } = defineProps<{
    projectOptions: SelectOption[]
  }>()

  const { t } = useI18n()

  const formData = defineModel<Task>('formData')

  const createdAtTimestamp = computed({
    get: (): number => formData.value?.createdAt.getTime() || Date.now(),
    set: (value: number): void => {
      if (formData.value) formData.value.createdAt = new Date(value)
    },
  })
</script>

<template>
  <div v-if="formData" class="flex-1">
    <n-form-item :label="t('form.project')" path="project">
      <n-select
        v-model:value="formData.project"
        :options="projectOptions"
        :placeholder="t('form.selectProject')"
        filterable
        tag
        class="shadow"
      />
    </n-form-item>

    <n-form-item :label="t('form.name')" path="name">
      <n-input v-model:value="formData.name" placeholder="" class="shadow" />
    </n-form-item>

    <n-form-item :label="t('form.creationDate')" path="createdAt">
      <n-date-picker
        v-model:value="createdAtTimestamp"
        type="datetime"
        placeholder=""
        class="w-full shadow"
        format="dd.MM.yyyy HH:mm"
      />
    </n-form-item>
  </div>
</template>
