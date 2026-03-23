<script setup lang="ts">
  import ButtonNavigation from '@components/shared/ButtonNavigation.vue'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Carousel from '@/components/tasksDashboard/carousel/Carousel.vue'
  import { SUMMARY_CARDS } from '@/constants/summaryCards'
  import { useSettingsStore } from '@/stores/settingsStore'

  const { t } = useI18n()
  const { settings } = useSettingsStore()

  const summaryCards = computed(() =>
    SUMMARY_CARDS.map((card, index) => ({
      id: index,
      label: t(card.title),
    })),
  )

  const defaultSummaryCard = SUMMARY_CARDS.findIndex(
    (card) => card.id === settings.defaultSummaryCard,
  )

  const currentSlide = ref<number>(defaultSummaryCard ?? 0)
</script>
<template>
  <div class="w-full mt-6">
    <ButtonNavigation v-model:selected-id="currentSlide" :buttons="summaryCards" class="mb-4" />
    <Carousel v-model:current-slide-id="currentSlide" :slide-count="summaryCards.length" />
  </div>
</template>
