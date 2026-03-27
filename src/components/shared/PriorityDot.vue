<script setup lang="ts">
  import { computed } from 'vue'

  import { getPriorityColor } from '@/utils/priorityUtils'

  const { priority, size = 10 } = defineProps<{
    priority: number
    size?: number
  }>()

  const color = computed(() => getPriorityColor(priority))
  const style = computed(() => ({
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color.value,
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: '0',
  }))
</script>

<template>
  <span :style="style" :title="`Priority ${priority}`" />
</template>
