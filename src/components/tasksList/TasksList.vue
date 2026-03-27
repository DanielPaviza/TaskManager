<script setup lang="ts">
  import ButtonNavigation from '@components/shared/ButtonNavigation.vue'
  import DeletedTasksTable from '@components/tasksList/DeletedTasksTable.vue'
  import TasksCategoryTable from '@components/tasksList/TasksCategoryTable.vue'
  import TasksDataTable from '@components/tasksList/dataTable/TasksDataTable.vue'
  import { NInput, NSelect } from 'naive-ui'

  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  import KanbanBoard from '@/components/tasksList/KanbanBoard.vue'
  import { useTasksColumns } from '@/composables/task/useTasksColumns'
  import { useTasksViews } from '@/composables/task/useTasksViews'
  import { useViewSort } from '@/composables/useViewSort'
  import router from '@/router'
  import { TaskList, TaskListKey } from '@/types/TaskList'

  const { t } = useI18n()
  const { columns: allColumns } = useTasksColumns()

  const { nameSortState, countSortState, toggleNameSort, toggleCountSort, getSortedCategories } =
    useViewSort()
  const { createViews } = useTasksViews()

  const VIEWS = computed<Record<Exclude<TaskListKey, 'kanban'>, TaskList>>(() =>
    createViews(nameSortState.value),
  )

  const defaultViewKey = 'kanban' as TaskListKey
  const defaultView: TaskList = VIEWS.value['allInOne']
  const currentViewKey = ref<TaskListKey>(defaultViewKey)
  const currentView = computed<TaskList>(
    () =>
      VIEWS.value[currentViewKey.value as Exclude<TaskListKey, 'kanban'>] ??
      VIEWS.value['allInOne'],
  )

  const isKanban = computed(() => currentViewKey.value === 'kanban')

  // Navigation buttons: kanban first, then table views
  const navButtons = computed(() => [
    { id: 'kanban' as TaskListKey, label: t('table.kanban') },
    ...Object.values(VIEWS.value)
      .filter((v) => v.id !== 'kanban')
      .map((v) => ({ id: v.id, label: v.label })),
  ])

  // Persistent per-view name filters
  const nameFiltersByView = ref<Record<TaskListKey, string>>({
    allInOne: '',
    byPriority: '',
    byState: '',
    byTags: '',
    kanban: '',
  })

  const nameFilter = computed<string>({
    get: () => nameFiltersByView.value[currentViewKey.value] ?? '',
    set: (value: string) => {
      nameFiltersByView.value[currentViewKey.value] = value
    },
  })

  const hideColumnSelectHeaders = computed(() => {
    return allColumns.value.map((col) => ({
      label: col.title,
      value: String(col.key),
    }))
  })

  const hiddenColumnKeys = ref<string[]>(
    allColumns.value.filter((col) => col.isHidden).map((col) => String(col.key)),
  )

  const columns = computed(() => {
    return allColumns.value.filter((col) => !hiddenColumnKeys.value.includes(String(col.key)))
  })

  const hideColumnsOnViewChange = (
    newView: TaskList | undefined,
    oldView: TaskList | undefined,
  ): void => {
    hiddenColumnKeys.value = [
      ...hiddenColumnKeys.value.filter((key) => !oldView?.hiddenColumnKeys.includes(key)),
      ...(newView?.hiddenColumnKeys || []),
    ]
  }

  const openTaskBulkEdit = (value: string): void => {
    const getPath = () => {
      switch (currentViewKey.value) {
        case 'byTags':
          return 'tag'
      }
    }

    if (currentViewKey.value === 'allInOne') return
    router.push(`/bulkEdit/${getPath()}/${encodeURIComponent(value)}`)
  }

  const filteredSortedCategories = computed(() => {
    if (isKanban.value || !currentView.value) return []
    const filteredCategories = currentView.value.categories.filter((category) => {
      const filterValue = nameFilter.value.toLowerCase()
      return category.toLowerCase().includes(filterValue)
    })

    return getSortedCategories(filteredCategories, currentView.value)
  })

  watch(
    currentView,
    (newView, oldView) => {
      if (!isKanban.value) hideColumnsOnViewChange(newView, oldView)
    },
    { immediate: true },
  )
</script>
<template>
  <div>
    <h2 class="font-bold text-2xl text-blue mb-2">
      {{ $t('table.viewTitle') }}
    </h2>

    <div class="flex items-end justify-between mb-4">
      <ButtonNavigation v-model:selected-id="currentViewKey" :buttons="navButtons" />
      <div v-if="!isKanban" class="flex items-end gap-2">
        <div class="">
          <div class="text-[14px] ms-2 font-semibold text-nowrap text-blue">
            {{ $t('table.hiddenColumns') }}
          </div>
          <n-select
            v-model:value="hiddenColumnKeys"
            class="min-w-[140px] hideColumnsSelect"
            :placeholder="$t('table.hiddenPlaceholder')"
            multiple
            :options="hideColumnSelectHeaders"
            clearable
          />
        </div>
        <div v-if="currentView?.enableSorting">
          <div class="text-[14px] ms-2 font-semibold text-nowrap text-blue">
            {{ $t('table.sorting') }}
          </div>
          <div class="flex gap-2">
            <button
              class="px-4 py-1.5 rounded border-2 transition-colors font-medium"
              :class="{
                'border-blue bg-blue text-white': nameSortState !== 'none',
                'border-gray-300 bg-white text-gray-700 hover:border-blue':
                  nameSortState === 'none',
              }"
              @click="toggleNameSort"
            >
              ABC
              <span v-if="nameSortState === 'asc'"> ↑</span>
              <span v-if="nameSortState === 'desc'"> ↓</span>
            </button>
            <button
              class="px-4 py-1.5 rounded border-2 transition-colors font-medium"
              :class="{
                'border-blue bg-blue text-white': countSortState !== 'none',
                'border-gray-300 bg-white text-gray-700 hover:border-blue':
                  countSortState === 'none',
              }"
              @click="toggleCountSort"
            >
              {{ $t('table.count') }}
              <span v-if="countSortState === 'asc'"> ↑</span>
              <span v-if="countSortState === 'desc'"> ↓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Kanban view -->
  <div v-if="isKanban" class="pb-10">
    <KanbanBoard />
  </div>

  <!-- Table views -->
  <template v-else>
    <div v-if="currentView.categories?.length > 0" class="pb-10">
      <div v-if="currentView.showFilter">
        <label class="text-[14px] ms-1 font-semibold text-nowrap text-blue">
          {{ $t('table.filterByName') }}
        </label>
        <n-input
          v-model:value="nameFilter"
          :placeholder="$t('table.filterPlaceholder')"
          clearable
        />
      </div>
      <TasksCategoryTable
        v-for="category in filteredSortedCategories"
        :key="category"
        :title="category"
        :tasks="currentView.getTasks(category)"
        :columns="columns"
        :is-collapsed-default="currentView.id != defaultView.id"
      >
        <template #default="{ data, title, columns: cols, isCollapsedDefault: collapsed }">
          <TasksDataTable
            :data="data"
            :columns="cols"
            :title="title"
            :is-collapsed-default="collapsed"
            :can-open-settings="currentView.id !== defaultView.id"
            @open-settings="openTaskBulkEdit(title)"
          />
        </template>
      </TasksCategoryTable>
    </div>

    <div v-else class="text-center text-blue py-8 text-xl">
      {{ $t('common.noRecordsFound') }}
    </div>
  </template>

  <!-- Deleted Tasks Section -->
  <div class="my-8">
    <DeletedTasksTable />
  </div>
</template>
<style scoped>
  :deep(.hideColumnsSelect .n-base-selection > div) {
    padding-top: 6px;
    padding-bottom: 4px;
  }
</style>
