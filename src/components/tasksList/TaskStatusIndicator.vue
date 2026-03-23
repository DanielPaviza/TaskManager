<script setup lang="ts">
  import Tooltip from '@components/shared/Tooltip.vue'

  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const { status } = defineProps<{
    status: 'new' | 'edited' | null
  }>()
</script>

<template>
  <div v-if="status" class="status-indicator">
    <Tooltip
      :text="status === 'new' ? t('table.newPurchase') : t('table.editedPurchase')"
      :color="status === 'new' ? 'var(--color-green-500)' : 'var(--color-orange-400)'"
    >
      <div
        class="status-dot"
        :class="{
          'bg-green-500': status === 'new',
          'bg-orange-400': status === 'edited',
        }"
      />
    </Tooltip>
  </div>
</template>

<style scoped>
  .status-indicator {
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: auto;
  }

  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>
