import { type SelectOption } from 'naive-ui'

import { type ComputedRef, computed } from 'vue'

import { useTasksStore } from '@/stores/tasksStore'
import { type Task } from '@/types/Task'

export function useTaskFormOptions(formData: ComputedRef<Task>) {
  const store = useTasksStore()

  const projectOptions = computed(() => {
    return store.projects.map((project) => ({ label: project, value: project }))
  })

  const tableGroupOptions = computed(() => {
    let allTableGroups: SelectOption[] = store.tableGroups.map((tableGroup) => ({
      label: tableGroup,
      value: tableGroup,
    }))
    // Ensure current tags are included in options, but not duplicated
    allTableGroups = [
      ...allTableGroups,
      ...formData.value.tags.map((tag) => ({ label: tag, value: tag })),
    ].filter((option, index, self) => index === self.findIndex((o) => o.value === option.value))

    return allTableGroups
  })

  const tagOptions = computed(() => {
    const allTags: SelectOption[] = store.tags.map((tag) => ({ label: tag, value: tag }))
    // Ensure current tableGroup is included in tags options, but not duplicated
    if (
      formData.value.tableGroup &&
      !allTags.find((tag) => tag.value === formData.value.tableGroup)
    )
      allTags.push({ label: formData.value.tableGroup, value: formData.value.tableGroup })

    return allTags
  })

  return {
    projectOptions,
    tableGroupOptions,
    tagOptions,
  }
}
