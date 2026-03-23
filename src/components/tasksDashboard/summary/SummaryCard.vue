<script setup lang="ts">
  import { NButton, NButtonGroup, NCard } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'

  import Chart from '@/components/tasksDashboard/summary/Chart.vue'
  import { useTasksStore } from '@/stores/tasksStore'

  const {
    title,
    subtitle,
    chartType = 'None',
    chartLabels,
    chartDatasets,
    chartTypeChangeEnabled = false,
    showFooter = true,
    showTotalPrice = false,
  } = defineProps({
    title: String,
    subtitle: String,
    chartType: String as () => 'None' | 'Bar' | 'Doughnut' | 'Line',
    chartLabels: Array as () => string[],
    chartDatasets: Array as () => {
      label: string
      data: number[]
      backgroundColor: string[] | string
      borderColor?: string[] | string
      borderWidth?: number
      tension?: number
    }[],
    chartTypeChangeEnabled: Boolean,
    showFooter: Boolean,
    showTotalPrice: Boolean,
  })

  const tasksStore = useTasksStore()
  const { tasks } = storeToRefs(tasksStore)

  const selectedChartType = ref<'Doughnut' | 'Bar' | 'Line'>(
    chartType !== 'None' ? (chartType as 'Doughnut' | 'Bar' | 'Line') : 'Doughnut',
  )

  const showContent = computed(() => {
    return tasks.value.length > 0
  })
</script>

<template>
  <div class="flex h-full">
    <n-card class="w-full pb-5">
      <div class="flex justify-between items-center mb-2">
        <div>
          <div class="text-2xl font-bold text-blue">
            {{ title }}
          </div>
          <div v-if="subtitle" class="text-sm text-gray-600 mt-1">
            {{ subtitle }}
          </div>
        </div>
        <n-button-group v-if="chartTypeChangeEnabled && chartType != 'None'" size="small">
          <div class="flex flex-col">
            <div class="flex justify-end mb-1">
              {{ $t('summary.chartType') }}
            </div>
            <div>
              <n-button
                :type="selectedChartType === 'Doughnut' ? 'primary' : 'default'"
                @click="selectedChartType = 'Doughnut'"
              >
                {{ $t('summary.donut') }}
              </n-button>
              <n-button
                :type="selectedChartType === 'Bar' ? 'primary' : 'default'"
                @click="selectedChartType = 'Bar'"
              >
                {{ $t('summary.bar') }}
              </n-button>
              <n-button
                :type="selectedChartType === 'Line' ? 'primary' : 'default'"
                @click="selectedChartType = 'Line'"
              >
                {{ $t('summary.line') }}
              </n-button>
            </div>
          </div>
        </n-button-group>
      </div>
      <hr class="mt-4 mb-6 text-blue" />
      <div class="flex flex-col md:flex-row xl:flex-col 2xl:flex-row justify-around">
        <div
          class="mb-6 md:mb-0 xl:mb-6 2xl:mb-0 flex flex-col text-lg gap-1 whitespace-nowrap justify-center"
        >
          <slot v-if="showContent" />
          <div v-else class="text-gray-500">
            {{ $t('common.noRecordsFound') }}
          </div>
        </div>
        <div
          v-if="chartType != 'None' && chartLabels && chartDatasets && showContent"
          class="flex justify-center items-center"
        >
          <Chart :type="selectedChartType" :labels="chartLabels" :datasets="chartDatasets" />
        </div>
      </div>
      <div v-if="showFooter && $slots.footer" class="mt-4">
        <hr class="mb-4 text-gray-300" />
        <slot name="footer" />
      </div>
      <template v-if="showTotalPrice">
        <hr class="mt-6 mb-3 border-blue-300" />
        <div class="flex font-bold w-full justify-between opacity-75">
          <div class="text-blue">{{ $t('summary.total') }}:</div>
        </div>
      </template>
    </n-card>
  </div>
</template>
<style scoped>
  .n-button--primary {
    --n-button-color: #3b82f6;
    --n-button-text-color: #ffffff;
  }
  :deep(.n-button--primary-type) {
    background-color: #3b82f6;
    color: white;
  }
  :deep(.n-button--primary-type:hover) {
    background-color: #3b82f6;
    color: white;
  }
  :deep(.n-button--default-type:hover) {
    background-color: #d0e5ff;
    color: black;
  }
  :deep(.n-button--default-type) {
    background-color: #e7f2ff;
  }
</style>
