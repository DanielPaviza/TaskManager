<script setup lang="ts">
  import PrioritySummary from '@components/tasksDashboard/summary/cards/PrioritySummary.vue'
  import ProjectSummary from '@components/tasksDashboard/summary/cards/ProjectSummary.vue'
  import StateSummary from '@components/tasksDashboard/summary/cards/StateSummary.vue'
  import TagSummary from '@components/tasksDashboard/summary/cards/TagSummary.vue'
  import { NCarousel } from 'naive-ui'

  import { markRaw } from 'vue'

  import CarouselSlide from '@/components/tasksDashboard/carousel/CarouselSlide.vue'

  const CARD_COMPONENTS: Record<string, object> = {
    tags: markRaw(TagSummary),
    states: markRaw(StateSummary),
    priorities: markRaw(PrioritySummary),
    projects: markRaw(ProjectSummary),
  }

  /**
   * slides: array of slides, each slide is an array of card-id strings.
   * Cards within a slide are rendered side-by-side.
   */
  const { slides } = defineProps<{
    slides: string[][]
  }>()

  const currentSlideId = defineModel<number>('current-slide-id', {
    required: false,
    default: 0,
  })
</script>

<template>
  <div class="carouselContainer relative w-full">
    <n-carousel
      v-model:current-index="currentSlideId"
      :show-dots="false"
      draggable
      :slides-per-view="1"
    >
      <CarouselSlide v-for="(slideCardIds, idx) in slides" :key="idx">
        <component
          :is="CARD_COMPONENTS[cardId]"
          v-for="cardId in slideCardIds"
          :key="cardId"
          class="flex-1 min-w-0"
        />
      </CarouselSlide>
    </n-carousel>
  </div>
</template>

<style scoped>
  :deep(.n-carousel) {
    position: static;
  }

  :deep(.n-carousel__slide) {
    height: auto !important;
  }

  :deep(.n-carousel.n-carousel--bottom .n-carousel__dots) {
    transform: translateX(0%);
    bottom: -24px;
    left: 20px;
  }

  :deep(.n-carousel__dot) {
    background-color: #a6a2b6 !important;
  }

  :deep(.n-carousel__dot--active) {
    background-color: #3b82f6 !important;
  }

  :deep(.n-carousel__arrow:hover) {
    background-color: rgba(59, 130, 246, 1);
    opacity: 1;
  }
</style>

<style scoped>
  :deep(.n-carousel) {
    position: static;
  }

  :deep(.n-carousel__slide) {
    height: auto !important;
  }

  :deep(.n-carousel.n-carousel--bottom .n-carousel__dots) {
    transform: translateX(0%);
    bottom: -24px;
    left: 20px;
  }

  :deep(.n-carousel__dot) {
    background-color: #a6a2b6 !important;
  }

  :deep(.n-carousel__dot--active) {
    background-color: #3b82f6 !important;
  }

  :deep(.n-carousel__arrow:hover) {
    background-color: rgba(59, 130, 246, 1);
    opacity: 1;
  }
</style>
