<script setup lang="ts">
  import { NInput, NSelect } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  import type { SpendingColumn } from '@/types/TaskColumn'

  const { t } = useI18n()

  const { columns, columnFilters, columnFilterOptions } = defineProps<{
    columns: SpendingColumn[]
    columnFilters: Record<string, string>
    columnFilterOptions: Record<string, Array<{ label: string; value: string }>>
  }>()

  const emit = defineEmits<{
    (e: 'update:filter', key: string, value: string): void
  }>()

  function updateFilter(key: string, value: string): void {
    emit('update:filter', key, value || '')
  }
</script>

<template>
  <tr class="bg-white">
    <th v-for="column in columns" :key="`filter-${String(column.key)}`">
      <div v-if="column.filterEnabled" class="px-2 py-1">
        <n-select
          v-if="column.selectFilterEnabled"
          :value="columnFilters[String(column.key)] || null"
          :options="columnFilterOptions[String(column.key)] || []"
          :placeholder="t('table.filterPlaceholder')"
          filterable
          tag
          clearable
          :class="{ 'border border-blue-300': columnFilters[String(column.key)] }"
          @update:value="(val) => updateFilter(String(column.key), val || '')"
        />
        <n-input
          v-else
          :value="columnFilters[String(column.key)] || ''"
          :placeholder="t('table.filterPlaceholder')"
          clearable
          :class="{ 'border border-blue-300': columnFilters[String(column.key)] }"
          @update:value="(val) => updateFilter(String(column.key), val || '')"
        />
      </div>
    </th>
    <th class="mx-2" />
  </tr>
</template>
