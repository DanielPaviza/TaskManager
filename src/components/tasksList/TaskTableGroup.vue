<script setup lang="ts">
  import TableRow from '@components/tasksList/dataTable/shared/TableRow.vue'
  import { ChevronForwardOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  import { ref, watch } from 'vue'

  import { useSettingsStore } from '@/stores/settingsStore'
  import type { Task } from '@/types/Task'
  import type { TaskColumn } from '@/types/TaskColumn'

  const { tableGroup, items, columns, isShownDefault } = defineProps<{
    tableGroup: string
    items: Task[]
    columns: TaskColumn[]
    isShownDefault?: boolean
  }>()

  const settingsStore = useSettingsStore()
  const isExpanded = ref(
    items.length <= 1 || isShownDefault || settingsStore.settings.tableGroupDefaultOpen,
  )

  function toggleExpanded(event: Event): void {
    event.stopPropagation()
    isExpanded.value = !isExpanded.value
  }

  watch(
    () => settingsStore.settings.tableGroupDefaultOpen,
    (newValue) => {
      isExpanded.value = newValue
    },
  )
</script>

<template>
  <tr
    class="bg-blue-50 hover:bg-blue-100 cursor-pointer border-b border-blue-200 px-4 py-2"
    @click="toggleExpanded"
  >
    <td class="py-2">
      <div class="flex items-center gap-2 ps-3">
        <n-icon
          :size="20"
          class="transition-transform text-blue-500"
          :class="{ 'rotate-90': isExpanded }"
        >
          <ChevronForwardOutline />
        </n-icon>
        <span class="font-semibold text-blue-500">{{ tableGroup }}</span>
        <span class="text-sm text-gray-600">({{ items.length }} {{ $t('table.items') }})</span>
      </div>
    </td>
    <td v-for="_ in columns.length - 2" :key="_" />
    <td class="font-bold ps-3" :class="isExpanded ? 'text-blue' : ' text-black'">
      <template v-if="!isExpanded"> </template>
    </td>
    <td />
  </tr>

  <template v-if="isExpanded">
    <TableRow
      v-for="(row, index) in items"
      :key="row.id"
      :row="row"
      :row-index="index"
      :columns="columns"
      is-table-group
    />
  </template>
</template>

<style scoped>
  .rotate-90 {
    transform: rotate(0deg);
  }
</style>
