<script setup lang="ts">
  import { NButton, NButtonGroup } from 'naive-ui'

  import type { SortType } from '@/composables/useEntityStats'

  interface SortOption {
    value: SortType
    label: string
  }

  const { options, modelValue } = defineProps<{
    options: SortOption[]
    modelValue: SortType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: SortType]
  }>()
</script>

<template>
  <div class="mb-3 flex gap-2 flex-wrap">
    <n-button-group size="tiny">
      <n-button
        v-for="option in options"
        :key="option.value"
        :type="modelValue === option.value ? 'primary' : 'default'"
        @click="emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </n-button>
    </n-button-group>
  </div>
</template>
