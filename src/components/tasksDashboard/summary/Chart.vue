<script setup lang="ts">
  import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
  } from 'chart.js'

  import { computed } from 'vue'
  import { Bar, Doughnut, Line } from 'vue-chartjs'

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  )

  const {
    type,
    labels,
    datasets = [],
  } = defineProps({
    type: String as () => 'Bar' | 'Doughnut' | 'Line',
    labels: Array as () => string[],
    datasets: Array as () => {
      label: string
      data: number[]
      backgroundColor: string[] | string
      borderColor?: string[] | string
      borderWidth?: number
      tension?: number
    }[],
  })

  const chartComponent = computed(() => {
    if (type === 'Bar') return Bar

    if (type === 'Line') return Line

    return Doughnut
  })
</script>

<template>
  <component
    :is="chartComponent"
    width="auto"
    :style="{
      width: '100%'!,
      maxWidth: '260px',
    }"
    :data="{
      labels: labels,
      datasets: datasets,
    }"
    :options="{
      responsive: true,
    }"
  />
</template>
