<script setup lang="ts">
  import { computed } from 'vue'

  import type { Task } from '@/types/Task'
  import type { TaskColumn } from '@/types/TaskColumn'
  import { sortTasksByDefault } from '@/utils/tableUtils'

  const {
    title,
    tasks: unorderedTasks,
    columns,
    isCollapsedDefault = false,
  } = defineProps<{
    title: string
    tasks: Task[]
    columns: TaskColumn[]
    isCollapsedDefault?: boolean
  }>()

  // Default order by category and createdAt
  const tasks = computed(() => sortTasksByDefault(unorderedTasks))
</script>

<template>
  <div class="overflow-x-auto my-8">
    <slot
      :data="tasks"
      :title="title"
      :columns="columns"
      :is-collapsed-default="isCollapsedDefault"
    />
  </div>
</template>
