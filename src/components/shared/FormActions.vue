<script setup lang="ts">
  import { SaveOutline, TrashOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  const {
    showDelete,
    showReset,
    saveText,
    canSave = true,
  } = defineProps<{
    showDelete?: boolean
    showReset?: boolean
    saveText: string
    canSave?: boolean
  }>()

  const emit = defineEmits<{
    save: []
    reset: []
    delete: []
    cancel: []
  }>()

  const { t } = useI18n()
</script>

<template>
  <div class="flex justify-between w-full gap-3">
    <div class="flex gap-3">
      <n-button @click="emit('cancel')">
        {{ t('common.cancel') }}
      </n-button>
      <n-button v-if="showReset" type="info" secondary @click="emit('reset')">
        {{ t('common.reset') }}
      </n-button>
      <n-button v-if="showDelete" color="#ef4444" @click="emit('delete')">
        <template #icon>
          <n-icon>
            <TrashOutline />
          </n-icon>
        </template>
        {{ t('dialogs.delete') }}
      </n-button>
    </div>
    <n-button :disabled="!canSave" color="#3b82f6" @click="emit('save')">
      <template #icon>
        <n-icon>
          <SaveOutline />
        </n-icon>
      </template>
      {{ saveText }}
    </n-button>
  </div>
</template>
