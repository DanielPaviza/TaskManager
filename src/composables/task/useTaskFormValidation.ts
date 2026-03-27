import { type FormRules } from 'naive-ui'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useTaskFormValidation() {
  const { t } = useI18n()

  const rules = computed<FormRules>(() => ({
    project: [{ required: true, message: t('validation.projectRequired'), trigger: 'blur' }],
    // name: [{ required: true, message: t('validation.nameRequired'), trigger: 'blur' }],
  }))

  return {
    rules,
  }
}
