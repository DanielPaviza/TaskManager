<script setup lang="ts">
  import { ArrowUpOutline, CloseCircleOutline, ListOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const { title, hasActiveFiltersOrSorting } = defineProps<{
    title: string
    isCollapsed: boolean
    hasActiveFiltersOrSorting: boolean
  }>()

  const emit = defineEmits<{
    (e: 'toggle-collapse'): void
    (e: 'clear-filters'): void
  }>()

  function toggleCollapse(): void {
    emit('toggle-collapse')
  }

  function clearFilters(): void {
    emit('clear-filters')
  }
</script>

<template>
  <div class="flex justify-between items-center">
    <div class="flex items-end w-full py-2">
      <n-icon size="32" class="collapseArrow" color="#3b82f6">
        <ArrowUpOutline />
      </n-icon>
      <n-icon size="32" class="listIcon" color="#3b82f6">
        <ListOutline />
      </n-icon>
      <h2 class="text-blue text-2xl me-4 ms-2 font-bold text-left">
        {{ title }}
      </h2>
      <div
        class="flex text-[15px] font-bold items-center gap-1 cursor-pointer text-black opacity-60 border-primaryDark border-b hover:text-blue hover:border-blue"
        @click="toggleCollapse"
      >
        {{ t('table.collapseTable') }}
      </div>
    </div>
    <div class="flex items-center">
      <div class="me-3 flex items-center">
        <n-button
          v-if="hasActiveFiltersOrSorting"
          size="tiny"
          color="#3b82f6"
          @click.stop="clearFilters"
        >
          <template #icon>
            <n-icon>
              <CloseCircleOutline />
            </n-icon>
          </template>
          {{ t('table.clearFiltersAndSorting') }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .collapseArrow {
    display: none;
    transition: transform 0.3s ease;
  }
  .collapseRow:hover .collapseArrow {
    display: flex;
  }
  .collapseRow:hover .listIcon {
    display: none;
  }
</style>
