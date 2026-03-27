<script setup lang="ts">
  import MarginContainer from '@components/shared/MarginContainer.vue'
  import { AddOutline, SettingsOutline } from '@vicons/ionicons5'
  import { NButton, NCollapseTransition, NIcon } from 'naive-ui'

  import { onBeforeUnmount, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import ProjectSelectDropdown from '@/components/header/components/ProjectSelectDropdown.vue'
  import ProjectSelectionPanel from '@/components/header/components/ProjectSelectionPanel.vue'
  import { useTasksStore } from '@/stores/tasksStore'

  const isDev = import.meta.env.DEV
  const store = useTasksStore()
  const router = useRouter()

  const isProjectSelectionOpen = ref(false)

  let previousBodyOverflow = ''

  //Handle scroll lock when project selection is open
  watch(isProjectSelectionOpen, (isOpen) => {
    if (isOpen) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else document.body.style.overflow = previousBodyOverflow
  })

  onBeforeUnmount(() => {
    document.body.style.overflow = previousBodyOverflow
  })

  function openNewSpendingForm(): void {
    router.push('/new')
  }

  function openSettings(): void {
    router.push('/settings')
  }

  function handleProjectSelect(project: string | null): void {
    store.projectView = project
    isProjectSelectionOpen.value = false
  }
</script>
<template>
  <div
    v-if="isProjectSelectionOpen"
    class="backdrop-blur-lg fixed w-screen h-screen border z-40"
    @click="isProjectSelectionOpen = false"
  ></div>

  <header
    id="header"
    class="sticky z-50 h-fit flex flex-col border-b-2 pt-4 pb-4 border-blue bg-blueLightTransparent backdrop-blur-md"
    :class="{
      'inset-0 overflow-hidden bg-white backdrop-blur-[10px]': isProjectSelectionOpen,
      'top-0': !isProjectSelectionOpen,
    }"
  >
    <MarginContainer class="h-full flex flex-col min-h-0 z-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-blue me-5">
            {{ $t('appTitle') }}
          </h1>
          <div class="mt-2">
            <n-button type="primary" color="#3b82f6" @click="openNewSpendingForm">
              <n-icon size="32">
                <AddOutline />
              </n-icon>
              <div class="font-bold">
                {{ $t('header.addNewTask') }}
              </div>
            </n-button>
          </div>
          <h1 class="text-4xl text-red font-bold ms-10">
            {{ isDev ? 'TEST' : '' }}
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <n-button color="#3b82f6" @click="openSettings">
            <n-icon size="24">
              <SettingsOutline />
            </n-icon>
          </n-button>
        </div>
      </div>
      <ProjectSelectDropdown v-model:is-open="isProjectSelectionOpen" />
      <!-- Project Selection Panel with animation -->
      <n-collapse-transition :show="isProjectSelectionOpen" name="expand-down">
        <ProjectSelectionPanel
          @select="handleProjectSelect"
          @close="isProjectSelectionOpen = false"
        />
      </n-collapse-transition>
    </MarginContainer>
  </header>
</template>
