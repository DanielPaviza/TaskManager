import { generateColorPalette } from '@utils/formatUtils'

import { type ComputedRef, type Ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { EntityStat, SortType } from './useEntityStats'

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor: string[] | string
  borderColor?: string[] | string
  borderWidth?: number
  tension?: number
}

export interface ChartOptions {
  stats: ComputedRef<EntityStat[]> | Ref<EntityStat[]>
  sortBy: Ref<SortType>
  labelKey: string
  countLabelKey?: string
  customColors?: string[]
}

export function useSummaryChart(options: ChartOptions) {
  const { stats, sortBy, labelKey, countLabelKey, customColors } = options
  const { t } = useI18n()

  const chartLabels = computed(() => stats.value.map((stat) => `${stat.name} (${stat.percent}%)`))

  const chartDatasets = computed<ChartDataset[]>(() => {
    const getData = (): number[] => {
      switch (sortBy.value) {
        case 'count-desc':
        case 'visits-desc':
          return stats.value.map((stat) => stat.visits ?? stat.count)
        case 'avg-desc':
          return stats.value.map((stat) => stat.avgPerVisit ?? 0)
        case 'price-desc':
        case 'price-asc':
        case 'alphabetical':
        default:
          return stats.value.map((stat) => stat.price)
      }
    }

    const getLabel = (): string => {
      switch (sortBy.value) {
        case 'count-desc':
          return countLabelKey ? t(countLabelKey) : t(labelKey)
        case 'visits-desc':
          return t('summary.storeVisits')
        case 'avg-desc':
          return t('summary.avgSpendingPerVisit')
        case 'price-desc':
        case 'price-asc':
        case 'alphabetical':
        default:
          return t(labelKey)
      }
    }

    return [
      {
        label: getLabel(),
        data: getData(),
        backgroundColor: customColors
          ? generateColorPalette(stats.value.length, customColors)
          : generateColorPalette(stats.value.length),
      },
    ]
  })

  return {
    chartLabels,
    chartDatasets,
  }
}
