<script setup lang="ts">
  import { NCollapseTransition } from 'naive-ui'

  import { computed, ref } from 'vue'

  import ProjectActionContext from '@/components/header/components/ProjectActionContext.vue'
  import TaskTableGroup from '@/components/tasksList/TaskTableGroup.vue'
  import CollapsedTableView from '@/components/tasksList/dataTable/shared/CollapsedTableView.vue'
  import TableFilterRow from '@/components/tasksList/dataTable/shared/TableFilterRow.vue'
  import TableFooter from '@/components/tasksList/dataTable/shared/TableFooter.vue'
  import TableHeader from '@/components/tasksList/dataTable/shared/TableHeader.vue'
  import TableRow from '@/components/tasksList/dataTable/shared/TableRow.vue'
  import TableToolbar from '@/components/tasksList/dataTable/shared/TableToolbar.vue'
  import { useTableFilter } from '@/composables/table/useTableFilter'
  import { useTableGrouping } from '@/composables/table/useTableGrouping'
  import { useTableSort } from '@/composables/table/useTableSort'
  import type { Task } from '@/types/Task'
  import { type TaskColumn } from '@/types/TaskColumn'

  const {
    data,
    title = '',
    columns,
    isCollapsedDefault = false,
    canOpenSettings,
  } = defineProps<{
    data: Task[]
    title?: string
    columns: TaskColumn[]
    isCollapsedDefault?: boolean
    canOpenSettings?: boolean
  }>()

  const isCollapsed = ref(isCollapsedDefault)
  const actionContextMouseEvent = ref<MouseEvent | null>(null)

  const emit = defineEmits<{
    (e: 'openSettings'): void
  }>()

  function handleContextMenu(event: MouseEvent): void {
    event.preventDefault()
    actionContextMouseEvent.value = event
  }

  // Use composables for filtering and sorting
  const { columnFilters, filteredData, columnFilterOptions, hasActiveFilters, clearFilters } =
    useTableFilter(
      () => data,
      () => columns,
    )

  const { sortState, sortedData, updateSort, clearSort } = useTableSort(
    () => filteredData.value,
    () => columns,
  )

  const { groupedData } = useTableGrouping(() => sortedData.value)

  const totalCountTasks = computed(() => sortedData.value.length)

  const hasActiveFiltersOrSorting = computed(() => {
    return sortState.value.key !== null || hasActiveFilters.value
  })

  function clearAllFiltersAndSorting(): void {
    clearFilters()
    clearSort()
  }

  function toggleCollapse(): void {
    isCollapsed.value = !isCollapsed.value
  }

  function updateFilter(key: string, value: string): void {
    columnFilters.value[key] = value
  }
</script>

<template>
  <div v-if="isCollapsed">
    <CollapsedTableView
      key="collapsed"
      :title="title"
      :total-count-tasks="totalCountTasks"
      @toggle-collapse="toggleCollapse"
      @contextmenu="handleContextMenu"
    />
    <ProjectActionContext
      v-if="canOpenSettings"
      :project="title"
      :mouse-event="actionContextMouseEvent"
      :on-edit="() => emit('openSettings')"
    />
  </div>

  <n-collapse-transition :show="!isCollapsed" name="expand-down">
    <TableToolbar
      :title="title"
      :is-collapsed="isCollapsed"
      :has-active-filters-or-sorting="hasActiveFiltersOrSorting"
      @toggle-collapse="toggleCollapse"
      @clear-filters="clearAllFiltersAndSorting"
    />

    <table class="border-collapse w-full">
      <TableHeader :columns="columns" :sort-state="sortState" @update:sort="updateSort" />

      <TableFilterRow
        :columns="columns"
        :column-filters="columnFilters"
        :column-filter-options="columnFilterOptions"
        @update:filter="updateFilter"
      />

      <tbody>
        <template v-for="(group, groupIndex) in groupedData" :key="`group-${groupIndex}`">
          <!-- Regular item without tableGroup -->
          <template v-if="group.type === 'item' && group.item">
            <TableRow :row="group.item" :row-index="groupIndex" :columns="columns" />
          </template>

          <!-- TableGroup group -->
          <TaskTableGroup
            v-else-if="group.type === 'group' && group.tableGroup && group.items"
            :table-group="group.tableGroup"
            :items="group.items"
            :columns="columns"
            :is-shown-default="group.items.length === data.length"
          />
        </template>
      </tbody>

      <TableFooter :total-count="totalCountTasks" :column-count="columns.length" />
    </table>
  </n-collapse-transition>
</template>

<style scoped>
  table {
    box-shadow:
      0 4px 6px -1px rgba(59, 130, 246, 0.1),
      0 2px 4px -1px rgba(59, 130, 246, 0.06);
  }

  :deep(.hideColumnsSelect .n-base-selection) {
    border: 1px solid rgba(59, 130, 246, 0.4);
  }
</style>
