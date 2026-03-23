<script setup lang="ts">
  interface ButtonOption {
    id: number | string
    label: string
    selectedColor?: string
    colorHover?: string
  }

  const { buttons, full } = defineProps<{
    buttons: ButtonOption[]
    full?: boolean
  }>()

  const selectedId = defineModel<number | string>('selectedId')

  const colorMap = {
    red: 'border-red-500 text-red-400 bg-red-100',
    blue: 'border-blue-500 text-blue-500 bg-blue-100',
    green: 'border-green-400 text-green-500 bg-green-50',
    orange: 'border-orange-400 text-orange-500 bg-orange-50',
    default: 'border-gray-300 text-gray-800 bg-gray-100',
  } as Record<string, string>

  const hoverColorMap = {
    red: 'hover:border-red-600 hover:text-red-500',
    blue: 'hover:border-blue-600 hover:text-blue-500',
    green: 'hover:border-green-600 hover:text-green-500',
    orange: 'hover:border-orange-600 hover:text-orange-500',
  } as Record<string, string>

  const defaultColor = 'blue'
  const defaultHoverColor = 'blue'

  const getButtonColorStyle = (button: ButtonOption): string => {
    if (selectedId.value !== button.id) return colorMap['default']
    return colorMap[button.selectedColor || defaultColor]
  }

  const getButtonHoverColorStyle = (button: ButtonOption): string => {
    return `${hoverColorMap[button.colorHover || defaultHoverColor]} hover:-translate-y-0.5 hover:shadow-md active:translate-y-0`
  }
</script>

<template>
  <div class="flex justify-center" :class="full ? 'w-full' : ''">
    <button
      v-for="(button, idx) in buttons"
      :key="button.id"
      :class="[
        'relative overflow-hidden border-2 px-14 py-2 text-sm font-medium cursor-pointer transition-all duration-300',
        idx === 0 ? 'rounded-l-lg' : '',
        full ? 'w-full' : '',
        idx === buttons.length - 1 ? 'rounded-r-lg' : '',
        getButtonColorStyle(button),
        getButtonHoverColorStyle(button),
      ]"
      @click="selectedId = button.id"
    >
      <span class="relative z-10">{{ button.label }}</span>
    </button>
  </div>
</template>
