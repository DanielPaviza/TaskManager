import { ENGLISH_LANGUAGE } from '@/constants/languages'
import { Settings } from '@/types/Settings'

export const DEFAULT_SETTINGS: Settings = {
  languageCode: ENGLISH_LANGUAGE.code,
  tableGroupDefaultOpen: false,
  defaultSummaryCard: 'tags',
  defaultProjectView: null,
  defaultHiddenTaskColumns: ['createdAt'],
}
