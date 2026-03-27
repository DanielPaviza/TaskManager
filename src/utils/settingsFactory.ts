import { reactive } from 'vue'

import { DEFAULT_SETTINGS } from '@/constants/defaultSettings'
import { Settings } from '@/types/Settings'

export function createSettings(data?: Partial<Settings>): Settings {
  return reactive({
    languageCode: data?.languageCode ?? DEFAULT_SETTINGS.languageCode,
    tableGroupDefaultOpen: data?.tableGroupDefaultOpen ?? DEFAULT_SETTINGS.tableGroupDefaultOpen,
    defaultSummaryCard: data?.defaultSummaryCard ?? DEFAULT_SETTINGS.defaultSummaryCard,
    defaultProjectView: data?.defaultProjectView ?? DEFAULT_SETTINGS.defaultProjectView,
    defaultHiddenTaskColumns:
      data?.defaultHiddenTaskColumns ?? DEFAULT_SETTINGS.defaultHiddenTaskColumns,
    showDashboard: data?.showDashboard ?? DEFAULT_SETTINGS.showDashboard,
  }) as Settings
}
