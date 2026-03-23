<script setup lang="ts">
  import { ArrowBack } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  import { computed } from 'vue'

  const { navigateDir } = defineProps({
    navigateDir: String as () => 'prev' | 'next' | undefined,
  })

  const emit = defineEmits<{
    (e: 'navigation-action'): void
  }>()

  const isNavNext = computed(() => navigateDir === 'next')
</script>

<template>
  <div class="w-full xl:w-[50%] shadow-lg">
    <div class="flex flex-col h-full">
      <slot />
      <div
        v-if="navigateDir"
        class="bg-blueLight/60 hover:bg-blueLight/90 p-1 flex cursor-pointer rounded-b"
        :class="isNavNext ? 'justify-end' : 'justify-start'"
        @click="emit('navigation-action')"
      >
        <n-icon size="24" class="text-white mx-5" :class="{ 'rotate-180': isNavNext }">
          <ArrowBack />
        </n-icon>
      </div>
    </div>
  </div>
</template>
