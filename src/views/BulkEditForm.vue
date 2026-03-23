<script setup lang="ts">
  import { useMessage } from 'naive-ui'

  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  import TaskBulkEditForm from '@/components/taskForm/TaskBulkEditForm.vue'
  import { useBulkEditForm } from '@/composables/useBulkEditForm'
  import { BulkEdit } from '@/constants/bulkEdit'

  function isBulkEdit(value: unknown): value is BulkEdit {
    return typeof value === 'string' && Object.values(BulkEdit).includes(value as BulkEdit)
  }

  const route = useRoute()
  const router = useRouter()
  const message = useMessage()
  const { t } = useI18n()
  const currentRouteName = route.name
  const routeTypeParam = route.params.type
  const routeNameParam = route.params.name

  if (
    typeof currentRouteName !== 'string' ||
    !isBulkEdit(routeTypeParam) ||
    typeof routeNameParam !== 'string'
  ) {
    message.error(t('messages.invalidBulkEditRoute'))
    void router.replace('/')
    throw new Error('BulkEditForm requires valid type and name route parameters')
  }

  const bulkEditForm = useBulkEditForm()
  const formProps = bulkEditForm.getBulkEditFormProps(routeTypeParam, routeNameParam)
</script>

<template>
  <TaskBulkEditForm :props="formProps" />
</template>
