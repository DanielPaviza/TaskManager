import { type FormRules } from 'naive-ui'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useTaskFormValidation() {
  const { t } = useI18n()

  const rules = computed<FormRules>(() => ({
    project: [{ required: true, message: t('validation.projectRequired'), trigger: 'blur' }],
    // type: [{ required: true, message: t('validation.typeRequired'), trigger: 'blur' }],
    // name: [{ required: true, message: t('validation.nameRequired'), trigger: 'blur' }],
    // payer: [{ required: true, message: t('validation.payerRequired'), trigger: 'blur' }],
    // quantity: [
    //   {
    //     required: true,
    //     type: 'number',
    //     message: t('validation.quantityRequired'),
    //     trigger: ['blur', 'change'],
    //   },
    //   {
    //     type: 'number',
    //     min: 0,
    //     message: t('validation.quantityMinZero'),
    //     trigger: ['blur', 'change'],
    //   },
    // ],
    // unitPrice: [
    //   {
    //     required: true,
    //     type: 'number',
    //     message: t('validation.unitPriceRequired'),
    //     trigger: ['blur', 'change'],
    //   },
    //   {
    //     type: 'number',
    //     min: 0,
    //     message: t('validation.priceCannotBeNegative'),
    //     trigger: ['blur', 'change'],
    //   },
    // ],
  }))

  return {
    rules,
  }
}
