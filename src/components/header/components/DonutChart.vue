<script setup lang="ts">
  import { computed } from 'vue'

  const { percent = 0, color = '#3b82f6' } = defineProps<{
    percent?: number
    color?: string
  }>()

  const clampedPercent = computed(() => {
    const value = Number.isFinite(percent) ? percent : 0
    return Math.min(100, Math.max(0, Math.round(value)))
  })

  const dashArray = computed(() => `${clampedPercent.value}, 100`)
</script>

<template>
  <div class="flex flex-col items-center">
    <svg viewBox="0 0 36 36" class="w-full h-full">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" stroke-width="3" />
      <circle
        cx="18"
        cy="18"
        r="15.9"
        fill="none"
        :stroke="color"
        stroke-width="3"
        :stroke-dasharray="dashArray"
        stroke-linecap="round"
        transform="rotate(-90 18 18)"
        class="transition-all duration-300"
      />
    </svg>
    <div class="mt-2 ms-2 text-sm font-medium text-gray-700">{{ clampedPercent }}%</div>
  </div>
</template>
