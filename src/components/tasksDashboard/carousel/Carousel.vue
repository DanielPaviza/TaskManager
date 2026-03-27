<script setup lang="ts">
  import TagSummary from '@components/tasksDashboard/summary/cards/TagSummary.vue'
  import { NCarousel } from 'naive-ui'

  import CarouselItem from '@/components/tasksDashboard/carousel/CarouselItem.vue'
  import CarouselSlide from '@/components/tasksDashboard/carousel/CarouselSlide.vue'

  const { slideCount } = defineProps<{
    slideCount: number
  }>()

  const currentSlideId = defineModel<number>('current-slide-id', {
    required: false,
    default: 0,
  })

  const nextSlide = () => {
    currentSlideId.value = (currentSlideId.value + 1) % slideCount
  }

  const prevSlide = () => {
    currentSlideId.value = (currentSlideId.value - 1 + slideCount) % slideCount
  }
</script>

<template>
  <div class="carouselContainer relative w-full">
    <n-carousel
      v-model:current-index="currentSlideId"
      :show-dots="false"
      draggable
      :slides-per-view="1"
    >
      <CarouselSlide>
        <CarouselItem navigate-dir="next" @navigation-action="prevSlide">
          <TagSummary />
        </CarouselItem>
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
