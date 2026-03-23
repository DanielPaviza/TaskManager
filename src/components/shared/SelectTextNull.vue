<script setup lang="ts">
  import { NSelect } from 'naive-ui'

  import { computed } from 'vue'

  const value = defineModel<string | null>('value', {
    required: true,
  })

  const { options, nullItemLabel } = defineProps<{
    options: Array<string | null> | Array<{ label: string; value: string | null }>
    nullItemLabel: string
  }>()

  const nullItem = {
    label: nullItemLabel,
    value: crypto.randomUUID(), // Unique value
  }

  const allOptions = computed(() => {
    const isSimpleArray: boolean = typeof options[0] === 'string' || options[0] === null
    const objectOptions = isSimpleArray
      ? options.map((opt) => ({ label: opt as string, value: opt as string | null }))
      : (options as Array<{ label: string; value: string | null }>)

    // Ensure no null option
    const filteredOptions: Array<{ label: string; value: string }> = objectOptions
      .filter((option) => option.value !== null)
      .map((option) => ({
        label: option.label,
        value: option.value as string,
      }))

    return [nullItem, ...filteredOptions]
  })

  const handleUpdateValue = (val: string) => {
    value.value = val === nullItem.value ? null : val
  }
</script>

<template>
  <n-select
    :value="value != null ? value : nullItem.value"
    :options="allOptions"
    clearable
    @update:value="handleUpdateValue"
  />
</template>
