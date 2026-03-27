<script setup lang="ts">
  import type { EntityStat } from '@/composables/useEntityStats'

  const {
    stat,
    showPercent = true,

    showCount = true,
    extraInfo,
  } = defineProps<{
    stat: EntityStat
    showPercent?: boolean
    showCount?: boolean
    extraInfo?: string
  }>()
</script>

<template>
  <div class="flex items-center justify-between gap-14 text-base">
    <div class="font-bold min-w-[100px] text-blue truncate" :title="stat.name">
      {{ stat.name }}:
    </div>
    <div class="flex gap-2 items-center">
      <div class="text-blue text-xs text-muted-foreground whitespace-nowrap flex justify-end">
        <template v-if="showPercent && showCount">
          ({{ stat.percent }}%, {{ stat.count }}×)
        </template>
        <template v-else-if="showPercent"> ({{ stat.percent }}%) </template>
        <template v-else-if="showCount"> ({{ stat.count }}×) </template>
        <template v-if="extraInfo">
          {{ extraInfo }}
        </template>
      </div>
    </div>
  </div>
</template>
