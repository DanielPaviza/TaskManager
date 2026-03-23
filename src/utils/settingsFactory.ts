import { reactive } from 'vue'

import { DEFAULT_SETTINGS } from '@/constants/defaultSettings'
import { Settings } from '@/types/Settings'

export function createSettings(data?: Partial<Settings>): Settings {
  return reactive({
    languageCode: data?.languageCode ?? DEFAULT_SETTINGS.languageCode,
    currencySymbol: data?.currencySymbol ?? DEFAULT_SETTINGS.currencySymbol,
    tableGroupDefaultOpen: data?.tableGroupDefaultOpen ?? DEFAULT_SETTINGS.tableGroupDefaultOpen,
    defaultSummaryCard: data?.defaultSummaryCard ?? DEFAULT_SETTINGS.defaultSummaryCard,
    defaultCategoryView: data?.defaultCategoryView ?? DEFAULT_SETTINGS.defaultCategoryView,
    defaultHiddenTaskColumns:
      data?.defaultHiddenTaskColumns ?? DEFAULT_SETTINGS.defaultHiddenTaskColumns,
  }) as Settings
}
