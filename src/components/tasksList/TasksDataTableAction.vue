<script setup lang="ts">
  import { NButton, NDropdown } from 'naive-ui'

  import { useSpendingDataTableAction } from '@/composables/task/useTaskDataTableAction'
  import type { Spending } from '@/types/Task'

  const { spending } = defineProps<{
    spending: Spending
  }>()

  const { actionOptions, handleActionSelect } = useSpendingDataTableAction()
</script>

<template>
  <div class="px-2 mt-1 flex justify-end">
    <n-dropdown
      :options="
        actionOptions.map((option) => ({
          ...option,
          label: option.label,
        }))
      "
      @select="handleActionSelect($event, spending)"
    >
      <n-button @click.stop>
        <div class="flex flex-col items-center justify-center font-bold text-[16px]">
          <span class="h-2 -mt-4">.</span>
          <span class="h-2">.</span>
          <span class="h-2">.</span>
        </div>
      </n-button>
    </n-dropdown>
  </div>
</template>
