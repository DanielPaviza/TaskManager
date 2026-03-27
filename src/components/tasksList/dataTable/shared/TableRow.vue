<script setup lang="ts">
  import TaskStatusIndicator from '@components/tasksList/TaskStatusIndicator.vue'

  import { type VNode, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import TasksDataTableAction from '@/components/tasksList/TasksDataTableAction.vue'
  import TasksDataTableActionContext from '@/components/tasksList/TasksDataTableActionContext.vue'
  import { useTaskStatus } from '@/composables/task/useTaskStatus'
  import type { Task } from '@/types/Task'
  import type { TaskColumn } from '@/types/TaskColumn'
  import { getCellContent } from '@/utils/tableUtils'

  const {
    row,
    rowIndex,
    columns,
    showActions = true,
    isTableGroup,
  } = defineProps<{
    row: Task
    rowIndex: number
    columns: TaskColumn[]
    showActions?: boolean
    isTableGroup?: boolean
  }>()

  const actionContextMouseEvent = ref<MouseEvent | null>(null)

  const emit = defineEmits<{
    (e: 'row-click', row: Task, event?: MouseEvent): void
  }>()

  const router = useRouter()
  const { getTaskStatus } = useTaskStatus()

  function handleRowClick(event?: MouseEvent): void {
    // Don't navigate if clicking on action buttons
    if (event && (event.target as HTMLElement).closest('.delete-button')) return

    emit('row-click', row, event)
    router.push(`/edit/${row.id}`)
  }

  function handleContextMenu(event: MouseEvent): void {
    event.preventDefault()
    actionContextMouseEvent.value = event
  }
</script>

<template>
  <tr
    class="hover:bg-blue-50 cursor-pointer row"
    style="position: relative"
    :class="isTableGroup ? 'border-l-2 border-blue-300 bg-[#fcfdff]' : 'bg-white'"
    @click="handleRowClick($event)"
    @contextmenu="handleContextMenu"
  >
    <td
      v-for="column in columns"
      :key="`${row.id}-${String(column.key)}`"
      class="border-b border-blue-200 px-4 py-2"
    >
      <template v-if="typeof getCellContent(column, row, rowIndex) === 'object'">
        <component :is="getCellContent(column, row, rowIndex) as VNode" />
      </template>
      <template v-else>
        {{ getCellContent(column, row, rowIndex) }}
      </template>
      <TaskStatusIndicator class="me-2" :status="getTaskStatus(row.id)" />
    </td>
    <td v-if="showActions" class="px-2 border-b border-blue-200">
      <div class="opacity-75 hover:opacity-100 mb-1">
        <TasksDataTableAction :task="row" />
      </div>
    </td>
  </tr>
  <TasksDataTableActionContext :task="row" :mouse-event="actionContextMouseEvent" />
</template>
<style scoped>
  .row {
    opacity: 1;
    animation-name: myAnimation;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes myAnimation {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
