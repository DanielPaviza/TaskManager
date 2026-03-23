<script setup lang="ts">
  import { OpenOutline } from '@vicons/ionicons5'
  import { NButton, NFormItem, NIcon, NInput } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  const { label } = defineProps<{
    label: string
  }>()

  const { t } = useI18n()
  const url = defineModel<string>('url')
</script>

<template>
  <n-form-item :label="label" path="url">
    <div class="flex gap-2 w-full">
      <div class="w-full">
        <n-input
          v-model:value="url"
          :placeholder="t('form.urlPlaceholder')"
          clearable
          class="shadow"
        />
      </div>
      <a v-if="url" :href="url" target="_blank">
        <n-button color="#3b82f6" :title="t('form.openLink')">
          <template #icon>
            <n-icon>
              <OpenOutline />
            </n-icon>
          </template>
        </n-button>
      </a>
    </div>
  </n-form-item>
</template>
