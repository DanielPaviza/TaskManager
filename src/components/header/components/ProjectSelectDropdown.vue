<script setup lang="ts">
  import { ChevronDownOutline, ChevronUpOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { useTasksStore } from '@/stores/tasksStore'

  const props = defineProps<{
    isOpen: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
  }>()

  const { t } = useI18n()
  const store = useTasksStore()
  const { projectView } = storeToRefs(store)

  const isOpenModel = computed({
    get: () => props.isOpen,
    set: (value: boolean) => emit('update:isOpen', value),
  })

  const toggleOpen = () => {
    isOpenModel.value = !isOpenModel.value
  }

  const displayedProject = computed(() => {
    return projectView.value ? projectView.value : t('common.allProjects')
  })
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between px-4 py-3 mt-3 bg-white border border-blue-500 rounded-[10px] cursor-pointer transition-all duration-200',
      isOpen ? 'bg-blue-50 border-blue-700' : '',
      'hover:bg-slate-50 hover:shadow-[0_2px_8px_rgba(59,130,246,0.15)]',
    ]"
    @click="toggleOpen"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <div class="text-sm text-slate-500 whitespace-nowrap">{{ t('header.selectedProject') }}:</div>
      <div
        class="text-lg font-semibold text-blue-900 whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {{ displayedProject }}
      </div>
    </div>
    <n-icon size="24" class="text-blue-500 ml-2 shrink-0 transition-transform duration-200">
      <ChevronUpOutline v-if="isOpen" />
      <ChevronDownOutline v-else />
    </n-icon>
  </div>
</template>
