<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const { totalCount, columnCount } = defineProps<{
    totalCount: number
    columnCount: number
  }>()
</script>

<template>
  <tfoot class="border-blue border-t bg-blue-100 text-blue">
    <tr class="font-bold text-lg">
      <td class="px-4 py-2">{{ t('table.total') }} ({{ totalCount }}):</td>
      <td v-for="_ in columnCount - 2" :key="_" />
      <td />
    </tr>
  </tfoot>
</template>

<style scoped>
  tfoot tr:last-child td:first-child {
    border-radius: 0 0 0 6px;
  }
  tfoot tr:last-child td:last-child {
    border-radius: 0 0 8px 0;
  }
</style>
