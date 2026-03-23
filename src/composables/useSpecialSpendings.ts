import { type ComputedRef, type Ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Spending } from '@/types/Task'

export interface SpecialSpendingsOptions {
  spendings: ComputedRef<Spending[]> | Ref<Spending[]>
  totalPrice: ComputedRef<number> | Ref<number>
  filterFn: (s: Spending) => boolean
  labelKeys: {
    paid: string
    special: string
  }
  colors: {
    paid: string
    special: string
  }
}

export function useSpecialSpendings(options: SpecialSpendingsOptions) {
  const { spendings, totalPrice, filterFn, labelKeys, colors } = options
  const { t } = useI18n()

  const specialSpendings = computed(() => spendings.value.filter(filterFn))

  const priceSpecial = computed(() =>
    specialSpendings.value.reduce((sum, s) => sum + s.totalPrice, 0),
  )

  const priceTotalWithSpecial = computed(() => totalPrice.value + priceSpecial.value)

  const priceSpecialPercent = computed(() => {
    const total = priceTotalWithSpecial.value
    if (!total || total === 0) return 0

    return Math.round((priceSpecial.value / total) * 100)
  })

  const chartLabels = computed(() => [
    `${t(labelKeys.paid)} (${100 - priceSpecialPercent.value}%)`,
    `${t(labelKeys.special)} (${priceSpecialPercent.value}%)`,
  ])

  const chartDatasets = computed(() => [
    {
      label: t(labelKeys.special),
      data: [totalPrice.value, priceSpecial.value],
      backgroundColor: [colors.paid, colors.special],
    },
  ])

  return {
    specialSpendings,
    priceSpecial,
    priceTotalWithSpecial,
    priceSpecialPercent,
    chartLabels,
    chartDatasets,
  }
}
