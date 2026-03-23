import { type FormRules } from 'naive-ui'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useSettingsFormValidation() {
  const { t } = useI18n()

  const rules = computed<FormRules>(() => ({
    currency: [{ required: true, message: t('validation.currencyRequired'), trigger: 'blur' }],
  }))

  return {
    rules,
  }
}
