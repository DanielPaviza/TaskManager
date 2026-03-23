<script setup lang="ts">
  import { NDropdown } from 'naive-ui'

  import { nextTick, ref, watch } from 'vue'

  import { useSpendingDataTableAction } from '@/composables/task/useTaskDataTableAction'
  import type { Spending } from '@/types/Task'

  const { spending, mouseEvent } = defineProps<{
    spending: Spending
    mouseEvent?: MouseEvent | null
  }>()

  const isOpen = ref<boolean>(false)
  const x = ref(0)
  const y = ref(0)
  const { actionOptions, handleActionSelect } = useSpendingDataTableAction()

  const openContextMenu = (event: MouseEvent): void => {
    event.preventDefault()
    isOpen.value = false
    nextTick().then(() => {
      isOpen.value = true
      x.value = event.clientX
      y.value = event.clientY
    })
  }

  watch(
    () => mouseEvent,
    () => {
      openContextMenu(mouseEvent as MouseEvent)
    },
  )
</script>

<template>
  <n-dropdown
    :options="
      actionOptions.map((option) => ({
        ...option,
        label: option.label,
      }))
    "
    trigger="manual"
    placement="bottom-start"
    :show="isOpen"
    :x="x"
    :y="y"
    :on-clickoutside="() => (isOpen = false)"
    @mouseleave="isOpen = false"
    @update:show="(v) => (isOpen = v)"
    @select="handleActionSelect($event, spending)"
  >
  </n-dropdown>
</template>
