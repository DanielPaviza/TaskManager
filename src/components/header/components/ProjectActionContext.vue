<script setup lang="ts">
  import { BuildOutline } from '@vicons/ionicons5'
  import { NDropdown } from 'naive-ui'

  import { nextTick, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { ActionContextItem } from '@/types/ActionContextItem'
  import { renderIcon } from '@/utils/iconUtils'

  const { mouseEvent, onEdit } = defineProps<{
    mouseEvent?: MouseEvent | null
    onEdit: (event: MouseEvent) => void
  }>()

  const isOpen = ref<boolean>(false)
  const x = ref(0)
  const y = ref(0)
  const { t } = useI18n()

  const actionOptions: ActionContextItem[] = [
    {
      label: t('actions.edit'),
      key: 'editCategory',
      icon: renderIcon(BuildOutline, 'orange'),
      handleAction: () => {
        onEdit(new MouseEvent('click'))
      },
    },
  ]

  const handleActionSelect = (key: string): void => {
    const action = actionOptions.find((option) => option.key === key)
    if (action && action.handleAction) action.handleAction()
  }

  const openContextMenu = (event: MouseEvent): void => {
    event.preventDefault()
    isOpen.value = false
    nextTick().then(() => {
      isOpen.value = true
      x.value = event.clientX
      y.value = event.clientY
    })
  }

  watch(
    () => mouseEvent,
    () => {
      openContextMenu(mouseEvent as MouseEvent)
    },
  )
</script>

<template>
  <n-dropdown
    :options="
      actionOptions.map((option) => ({
        ...option,
        label: option.label,
      }))
    "
    trigger="manual"
    placement="bottom-start"
    :show="isOpen"
    :x="x"
    :y="y"
    :on-clickoutside="() => (isOpen = false)"
    @mouseleave="isOpen = false"
    @update:show="(v) => (isOpen = v)"
    @select="handleActionSelect"
  >
  </n-dropdown>
</template>
