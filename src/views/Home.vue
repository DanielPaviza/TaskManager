<script setup lang="ts">
  import MarginContainer from '@components/shared/MarginContainer.vue'
  import TasksDashboard from '@components/tasksDashboard/Dashboard.vue'
  import TasksList from '@components/tasksList/TasksList.vue'
</script>

<template>
  <MarginContainer>
    <TasksDashboard />
    <hr class="mt-8 mb-6 border-blueLight/40" />
    <TasksList />
  </MarginContainer>
  <router-view />
</template>
