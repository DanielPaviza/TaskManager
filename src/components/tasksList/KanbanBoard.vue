<script setup lang="ts">
  import {
    BuildOutline,
    ChevronBack,
    ChevronForward,
    CopyOutline,
    TrashOutline,
  } from '@vicons/ionicons5'
  import { NIcon, useDialog, useMessage } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import PriorityDot from '@/components/shared/PriorityDot.vue'
  import { State } from '@/constants/taskState'
  import { useTasksStore } from '@/stores/tasksStore'
  import type { Task } from '@/types/Task'
  import { getPriorityColor } from '@/utils/priorityUtils'

  const { t } = useI18n()
  const router = useRouter()
  const dialog = useDialog()
  const message = useMessage()
  const store = useTasksStore()
  const { tasks, projectView } = storeToRefs(store)

  type Column = {
    id: State
    label: string
    color: string
    headerBg: string
    border: string
    flexClass: string
  }

  const columns: Column[] = [
    {
      id: State.todo,
      label: t('kanban.todo'),
      color: 'text-blue-700',
      headerBg: 'bg-blue-100',
      border: 'border-blue-300',
      flexClass: 'flex-[2]',
    },
    {
      id: State.doing,
      label: t('kanban.doing'),
      color: 'text-orange-700',
      headerBg: 'bg-orange-100',
      border: 'border-orange-300',
      flexClass: 'flex-[1.5]',
    },
    {
      id: State.done,
      label: t('kanban.done'),
      color: 'text-green-700',
      headerBg: 'bg-green-100',
      border: 'border-green-300',
      flexClass: 'flex-[1.5]',
    },
  ]

  const getColumnTasks = (stateId: State) =>
    computed(() => tasks.value.filter((t) => t.state === stateId))

  const todoTasks = getColumnTasks(State.todo)
  const doingTasks = getColumnTasks(State.doing)
  const doneTasks = getColumnTasks(State.done)

  const columnTasksMap = computed(() => ({
    [State.todo]: todoTasks.value,
    [State.doing]: doingTasks.value,
    [State.done]: doneTasks.value,
  }))

  const stateOrder: State[] = [State.todo, State.doing, State.done]

  function moveTask(task: Task, direction: 'prev' | 'next') {
    const idx = stateOrder.indexOf(task.state)
    const newIdx = direction === 'next' ? idx + 1 : idx - 1
    if (newIdx < 0 || newIdx >= stateOrder.length) return
    store.updateTask(task.id, { ...task, state: stateOrder[newIdx], editedAt: new Date() })
  }

  // Drag-and-drop
  const draggedTaskId = ref<string | null>(null)
  const dragOverColumn = ref<State | null>(null)

  function onDragStart(task: Task, event: DragEvent) {
    draggedTaskId.value = task.id
    event.dataTransfer!.effectAllowed = 'move'
    event.dataTransfer!.setData('text/plain', task.id)
  }

  function onDragOver(colId: State, event: DragEvent) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
    dragOverColumn.value = colId
  }

  function onDragLeave() {
    dragOverColumn.value = null
  }

  function onDrop(colId: State, event: DragEvent) {
    event.preventDefault()
    dragOverColumn.value = null
    const id = event.dataTransfer?.getData('text/plain') ?? draggedTaskId.value
    if (!id) return
    const task = tasks.value.find((t) => t.id === id)
    if (!task || task.state === colId) return
    store.updateTask(task.id, { ...task, state: colId, editedAt: new Date() })
    draggedTaskId.value = null
  }

  function onDragEnd() {
    draggedTaskId.value = null
    dragOverColumn.value = null
  }

  function deleteTask(task: Task) {
    dialog.warning({
      title: t('dialogs.deleteTaskTitle'),
      content: t('dialogs.deleteTaskContent', { name: task.name }),
      positiveText: t('dialogs.delete'),
      negativeText: t('common.cancel'),
      onPositiveClick: () => {
        store.removeTask(task.id)
        message.success(t('messages.taskDeletedSuccessfully'))
      },
    })
  }

  function editTask(task: Task) {
    router.push(`/edit/${task.id}`)
  }

  function copyTask(task: Task) {
    router.push({ path: '/new', query: { template: task.id } })
  }

  const showAllProjects = computed(() => projectView.value === null)

  // Sticky note colours cycling
  const NOTE_COLORS = [
    'bg-yellow-100 border-yellow-300',
    'bg-blue-50 border-blue-200',
    'bg-pink-50 border-pink-200',
    'bg-purple-50 border-purple-200',
    'bg-green-50 border-green-200',
  ]

  function getNoteColor(task: Task): string {
    // Deterministic colour based on task id
    let hash = 0
    for (let i = 0; i < task.id.length; i++) hash = task.id.charCodeAt(i) + ((hash << 5) - hash)
    return NOTE_COLORS[Math.abs(hash) % NOTE_COLORS.length]
  }
</script>

<template>
  <div class="kanban-board flex gap-4 w-full pb-4 min-h-[400px]">
    <div
      v-for="col in columns"
      :key="col.id"
      class="kanban-column flex flex-col rounded-xl border-2 transition-colors duration-200 min-w-0"
      :class="[
        col.flexClass,
        col.border,
        dragOverColumn === col.id ? 'ring-2 ring-blue-400 bg-blue-50/40' : 'bg-gray-50',
      ]"
      @dragover="onDragOver(col.id, $event)"
      @dragleave="onDragLeave"
      @drop="onDrop(col.id, $event)"
    >
      <!-- Column header -->
      <div class="flex items-center justify-between px-4 py-3 rounded-t-xl" :class="col.headerBg">
        <span class="font-bold text-base" :class="col.color">{{ col.label }}</span>
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70" :class="col.color">
          {{ columnTasksMap[col.id].length }}
        </span>
      </div>

      <!-- Cards -->
      <div
        class="p-3 flex-1 overflow-y-auto"
        :class="col.id === 'todo' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'"
      >
        <div
          v-for="task in columnTasksMap[col.id]"
          :key="task.id"
          class="kanban-card border-2 rounded-lg px-3 py-2 shadow-sm cursor-grab active:cursor-grabbing select-none transition-opacity duration-150"
          :class="[getNoteColor(task), draggedTaskId === task.id ? 'opacity-40' : 'opacity-100']"
          draggable="true"
          @click="editTask(task)"
          @dragstart="onDragStart(task, $event)"
          @dragend="onDragEnd"
        >
          <!-- Title -->
          <div class="font-semibold text-sm text-gray-800 mb-1.5 wrap-break-word leading-snug">
            {{ task.name }}
          </div>

          <!-- Project (all-projects view) -->
          <div v-if="showAllProjects" class="text-xs text-gray-500 mb-1.5 font-medium">
            {{ task.project }}
          </div>

          <!-- Priority + tags row -->
          <div class="flex flex-wrap items-center gap-1.5 mb-2">
            <div
              class="flex items-center gap-1 px-1.5 py-0.5 rounded-full border font-bold text-xs"
              :style="{
                borderColor: getPriorityColor(task.priority),
                color: getPriorityColor(task.priority),
                background: getPriorityColor(task.priority) + '1a',
              }"
            >
              <PriorityDot :priority="task.priority" :size="8" />
              {{ task.priority }}
            </div>
            <span
              v-for="tag in task.tags"
              :key="tag"
              class="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Description snippet -->
          <div v-if="task.description" class="text-xs text-gray-400 mb-2 line-clamp-2 leading-snug">
            {{ task.description }}
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between mt-1 pt-1 border-t border-black/10">
            <!-- Move left -->
            <button
              class="p-0.5 rounded transition-colors hover:bg-black/10 disabled:opacity-25"
              :disabled="stateOrder.indexOf(task.state) === 0"
              :title="$t('kanban.moveLeft')"
              @click.stop="moveTask(task, 'prev')"
            >
              <n-icon size="16" class="text-gray-500">
                <ChevronBack />
              </n-icon>
            </button>

            <div class="flex items-center gap-0.5">
              <!-- Edit -->
              <button
                class="p-0.5 rounded transition-colors hover:bg-black/10"
                :title="$t('actions.edit')"
                @click.stop="editTask(task)"
              >
                <n-icon size="15" class="text-orange-500">
                  <BuildOutline />
                </n-icon>
              </button>
              <!-- Copy -->
              <button
                class="p-0.5 rounded transition-colors hover:bg-black/10"
                :title="$t('actions.copy')"
                @click.stop="copyTask(task)"
              >
                <n-icon size="15" class="text-green-500">
                  <CopyOutline />
                </n-icon>
              </button>
              <!-- Delete -->
              <button
                class="p-0.5 rounded transition-colors hover:bg-black/10"
                :title="$t('actions.delete')"
                @click.stop="deleteTask(task)"
              >
                <n-icon size="15" class="text-red-500">
                  <TrashOutline />
                </n-icon>
              </button>
            </div>

            <!-- Move right -->
            <button
              class="p-0.5 rounded transition-colors hover:bg-black/10 disabled:opacity-25"
              :disabled="stateOrder.indexOf(task.state) === stateOrder.length - 1"
              :title="$t('kanban.moveRight')"
              @click.stop="moveTask(task, 'next')"
            >
              <n-icon size="16" class="text-gray-500">
                <ChevronForward />
              </n-icon>
            </button>
          </div>
        </div>

        <!-- Empty state drop zone -->
        <div
          v-if="columnTasksMap[col.id].length === 0"
          class="flex-1 flex items-center justify-center text-sm text-gray-400 py-10 rounded-lg border-2 border-dashed border-gray-300 min-h-20"
        >
          {{ $t('kanban.dropHere') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .kanban-board {
    align-items: flex-start;
  }

  .kanban-column {
    min-height: 200px;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
