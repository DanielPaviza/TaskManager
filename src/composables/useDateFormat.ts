import { useI18n } from 'vue-i18n'

import { type DateFormat } from '@/types/DateFormat'

export const formatDateLocalized = (date: Date, format: DateFormat = 'short'): string => {
  const { locale, d } = useI18n()
  const formatted = d(date, format, locale.value)
  return String(formatted)
}
