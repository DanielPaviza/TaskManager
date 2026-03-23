<script setup lang="ts">
  import { ArrowDownOutline, ListOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  const { title, totalCountTasks } = defineProps<{
    title: string
    totalCountTasks: number
  }>()

  const emit = defineEmits<{
    (e: 'toggle-collapse'): void
  }>()

  function toggleCollapse(): void {
    emit('toggle-collapse')
  }
</script>

<template>
  <div
    class="collapsedRow bg-blue-300 shadow text-white cursor-pointer w-full p-3 flex items-center justify-between rounded hover:bg-blue-500"
    @click="toggleCollapse"
  >
    <div class="flex items-center gap-4">
      <n-icon class="listIcon" size="32">
        <ListOutline />
      </n-icon>
      <n-icon class="unCollapseIcon" size="32">
        <ArrowDownOutline />
      </n-icon>
      <h2 class="text-xl font-bold text-left">
        {{ title }}
        <small class="opacity-80">({{ totalCountTasks }}x)</small>
      </h2>
    </div>
  </div>
</template>

<style scoped>
  .collapsedRow:hover .listIcon {
    display: none;
  }
  .collapsedRow:hover .unCollapseIcon {
    display: inline;
  }
  .unCollapseIcon {
    display: none;
  }
  .collapseRow:hover h2,
  .collapseRow:hover div {
    color: #3b82f6 !important;
  }
</style>
