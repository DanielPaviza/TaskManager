<script setup lang="ts">
  import { NSelect } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  const value = defineModel<boolean>('value', {
    type: Boolean,
    required: true,
  })

  const { t } = useI18n()
</script>

<template>
  <n-select
    :value="value.toString()"
    :options="[
      { label: t('common.yes'), value: true.toString() },
      { label: t('common.no'), value: false.toString() },
    ]"
    @update:value="
      (v: string) => {
        value = v === 'true'
      }
    "
  />
</template>
