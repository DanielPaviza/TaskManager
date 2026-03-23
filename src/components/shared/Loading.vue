<script setup lang="ts">
  import { NSkeleton } from 'naive-ui'

  import MarginContainer from '@/components/shared/MarginContainer.vue'
</script>
<template>
  <div class="flex items-center flex-col h-screen overflow-hidden">
    <div
      class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-blue"
    >
      {{ $t('common.loadingData') }}
    </div>
    <header class="border-b-2 py-4 border-blue bg-whiteTransparent backdrop-blur-md w-screen">
      <MarginContainer>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <h1 class="text-4xl font-extrabold tracking-tight text-blue me-5">
              {{ $t('appTitle') }}
            </h1>
          </div>
          <div class="flex items-center">
            <n-skeleton width="100px" text class="me-2" />
            <n-skeleton width="100px" text class="me-4" />
            <n-skeleton width="50px" height="36px" :sharp="false" />
          </div>
        </div>
        <n-skeleton width="100%" height="50px" :sharp="false" class="mt-4" />
      </MarginContainer>
    </header>

    <div class="w-full mt-10">
      <MarginContainer class="flex flex-col">
        <div class="flex gap-px justify-center">
          <n-skeleton width="205px" height="38px" :sharp="false" />
          <n-skeleton width="205px" height="38px" :sharp="false" />
          <n-skeleton width="205px" height="38px" :sharp="false" />
          <n-skeleton width="205px" height="38px" :sharp="false" />
        </div>
        <div class="flex mt-4 gap-4">
          <n-skeleton width="50%" height="500px" :sharp="false" />
          <n-skeleton width="50%" height="500px" :sharp="false" />
        </div>
        <hr class="mt-8 mb-6 border-blueLight/40" />

        <div>
          <n-skeleton width="300px" text class="mt-2" />
          <div class="flex items-center justify-between">
            <div class="flex gap-px mt-8">
              <n-skeleton width="205px" height="38px" :sharp="false" />
              <n-skeleton width="205px" height="38px" :sharp="false" />
              <n-skeleton width="205px" height="38px" :sharp="false" />
              <n-skeleton width="205px" height="38px" :sharp="false" />
            </div>
            <div>
              <n-skeleton width="100px" text class="ms-2" />
              <n-skeleton width="150px" height="44px" :sharp="false" />
            </div>
          </div>
        </div>

        <div class="mt-8">
          <div class="flex items-center">
            <n-skeleton width="32px" height="32px" :sharp="false" class="me-2" />
            <n-skeleton width="160px" text class="me-2" />
            <n-skeleton width="120px" text />
          </div>
          <n-skeleton width="100%" height="62px" :sharp="false" class="mt-2" />
        </div>
      </MarginContainer>
    </div>
  </div>
</template>
<style scoped>
  :deep(.n-spin) {
    color: #3b82f6;
  }
</style>
