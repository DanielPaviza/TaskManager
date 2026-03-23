<script setup lang="ts">
  import AppContent from '@components/AppContent.vue'
  import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
</script>

<template>
  <NConfigProvider>
    <NDialogProvider>
      <NMessageProvider>
        <AppContent />
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
