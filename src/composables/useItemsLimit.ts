import { type ComputedRef, type Ref, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useItemsLimit<T>(
  items: ComputedRef<T[]> | Ref<T[]>,
  maxItems: number = 8,
): {
  displayedItems: ComputedRef<T[]>
  showAll: Ref<boolean>
  hasMore: ComputedRef<boolean>
  toggleText: ComputedRef<string>
} {
  const { t } = useI18n()
  const showAll = ref(false)

  const displayedItems = computed(() => {
    return showAll.value ? items.value : items.value.slice(0, maxItems)
  })

  const hasMore = computed(() => items.value.length > maxItems)

  const toggleText = computed(() => {
    return showAll.value
      ? t('common.showLessArrowCount')
      : t('common.showAllArrowCount', { count: items.value.length })
  })

  return {
    displayedItems,
    showAll,
    hasMore,
    toggleText,
  }
}
