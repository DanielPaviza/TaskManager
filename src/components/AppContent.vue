<script setup lang="ts">
  import Header from '@components/header/Header.vue'

  import { computed, onMounted } from 'vue'

  import Loading from '@/components/shared/Loading.vue'
  import { useSettingsStore } from '@/stores/settingsStore'
  import { useTasksStore } from '@/stores/tasksStore'

  const tasksStore = useTasksStore()
  const settingsStore = useSettingsStore()

  onMounted(async () => {
    await tasksStore.load()
    await settingsStore.load()
  })

  const isLoading = computed(() => {
    return tasksStore.isLoading || settingsStore.isLoading
  })
</script>

<template>
  <Loading v-if="isLoading" />
  <template v-else>
    <Header />
    <router-view />
  </template>
</template>
