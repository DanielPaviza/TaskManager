<script setup lang="ts">
  import ButtonNavigation from '@components/shared/ButtonNavigation.vue'
  import { EyeOffOutline, EyeOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Carousel from '@/components/tasksDashboard/carousel/Carousel.vue'
  import { SUMMARY_SLIDES } from '@/constants/summaryCards'
  import { useSettingsStore } from '@/stores/settingsStore'
  import { useTasksStore } from '@/stores/tasksStore'

  const { t } = useI18n()
  const settingsStore = useSettingsStore()
  const { settings } = settingsStore
  const store = useTasksStore()
  const { projectView } = storeToRefs(store)

  // Local mirror of the showDashboard setting so toggling is instant
  const isVisible = ref(settings.showDashboard)

  function toggleVisibility() {
    isVisible.value = !isVisible.value
    settingsStore.save({ ...settings, showDashboard: isVisible.value })
  }

  // Build per-slide card lists — filter 'projects' when a project is selected
  const activeSlides = computed(() =>
    SUMMARY_SLIDES.map((slide) => ({
      ...slide,
      cardIds: slide.cardIds.filter(
        (cardId) => cardId !== 'projects' || projectView.value === null,
      ),
    })),
  )

  const slideButtons = computed(() =>
    activeSlides.value.map((slide, index) => ({ id: index, label: t(slide.title) })),
  )

  const defaultSlideIndex = computed(() => {
    const idx = activeSlides.value.findIndex((s) => s.id === settings.defaultSummaryCard)
    return idx >= 0 ? idx : 0
  })

  const currentSlide = ref<number>(defaultSlideIndex.value)

  watch(activeSlides, () => {
    if (currentSlide.value >= activeSlides.value.length) currentSlide.value = 0
  })
</script>
<template>
  <div class="w-full mt-6">
    <!-- Header row: nav buttons + toggle -->
    <div class="flex items-center justify-between mb-4">
      <ButtonNavigation
        v-if="isVisible"
        v-model:selected-id="currentSlide"
        :buttons="slideButtons"
      />
      <div v-else class="text-sm text-gray-400 italic">{{ $t('dashboard.hidden') }}</div>

      <button
        class="ml-4 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        :title="isVisible ? $t('dashboard.hideSummary') : $t('dashboard.showSummary')"
        @click="toggleVisibility"
      >
        <n-icon size="15">
          <EyeOffOutline v-if="isVisible" />
          <EyeOutline v-else />
        </n-icon>
        {{ isVisible ? $t('dashboard.hideSummary') : $t('dashboard.showSummary') }}
      </button>
    </div>

    <!-- Carousel -->
    <Carousel
      v-if="isVisible"
      v-model:current-slide-id="currentSlide"
      :slides="activeSlides.map((s) => s.cardIds)"
    />
  </div>
</template>
