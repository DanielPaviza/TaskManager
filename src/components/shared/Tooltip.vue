<script setup lang="ts">
  import { HelpOutline } from '@vicons/ionicons5'
  import { NIcon, NTooltip } from 'naive-ui'

  const {
    text,
    color = '#60a5fa', // blueLight
    small,
  } = defineProps<{
    text: string
    color?: string
    small?: boolean
  }>()
</script>
<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div
        class="flex items-center justify-center border rounded-[50%] p-1"
        :class="small ? 'w-5 h-5' : 'w-6 h-6'"
        :style="{ borderColor: color }"
      >
        <n-icon :color="color">
          <HelpOutline />
        </n-icon>
      </div>
    </template>
    <div class="flex items-center">
      {{ text }}
      <div class="ms-2">
        <slot />
      </div>
    </div>
  </n-tooltip>
</template>
