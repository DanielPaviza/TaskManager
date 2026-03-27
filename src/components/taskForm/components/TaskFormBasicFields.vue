<script setup lang="ts">
  import { NDatePicker, NFormItem, NInput, NSelect, type SelectOption } from 'naive-ui'

  import { computed, h } from 'vue'
  import { useI18n } from 'vue-i18n'

  import PriorityDot from '@/components/shared/PriorityDot.vue'
  import { Priority } from '@/constants/taskPriority'
  import { State } from '@/constants/taskState'
  import type { Task } from '@/types/Task'
  import { getPriorityColor } from '@/utils/priorityUtils'

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

  const priorityOptions = computed(() =>
    Object.values(Priority).map((p) => ({ label: String(p), value: p })),
  )

  const stateOptions = computed(() =>
    Object.values(State).map((s) => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      value: s,
    })),
  )

  const renderPriorityLabel = (option: SelectOption) => {
    return h('div', { class: 'flex items-center gap-1.5' }, [
      h(PriorityDot, { priority: Number(option.value), size: 10 }),
      h(
        'span',
        { style: { color: getPriorityColor(Number(option.value)), fontWeight: '600' } },
        String(option.label),
      ),
    ])
  }
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

    <div class="flex gap-3">
      <n-form-item :label="t('columns.priority')" path="priority" class="flex-1">
        <n-select
          v-model:value="formData.priority"
          :options="priorityOptions"
          :render-label="renderPriorityLabel"
          class="shadow"
        />
      </n-form-item>

      <n-form-item :label="t('columns.state')" path="state" class="flex-1">
        <n-select v-model:value="formData.state" :options="stateOptions" class="shadow" />
      </n-form-item>
    </div>

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
