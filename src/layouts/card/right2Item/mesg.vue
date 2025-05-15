<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 初始化图表
function initChart() {
  if (!chartRef.value)
    return
  chartInstance = echarts.init(chartRef.value)

  const option: echarts.EChartsOption = {
    xAxis: {
      show: false,
      max: 100,
    },
    yAxis: {
      type: 'category',
      data: ['HP'],
      show: false,
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'bar',
        data: [acs.itemPF],
        barWidth: '100%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#003f8f' },
              { offset: 1, color: '#00aaff' },
            ],
          },
          borderRadius: 4,
        },
        z: 2,
      },
      {
        type: 'bar',
        data: [100],
        barWidth: '100%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#e0f7ff' },
              { offset: 1, color: '#b3e5fc' },
            ],
          },
          borderRadius: 4,
        },
        barGap: '-100%',
        z: 1,
      },
    ],
    animation: true,
  }

  chartInstance.setOption(option)
}

// 当 hpPercent 改变时更新血量
watch(() => acs.itemPF, (newVal) => {
  let hpValue = newVal * 100
  if (hpValue > 100) {
    hpValue = 100
  }
  if (chartInstance) {
    chartInstance.setOption({
      series: [
        { data: [hpValue] },
        { data: [100] },
      ],
    })
  }
})

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})
</script>

<template>
  <div ref="chartRef" class="w-40 h-5" />
</template>

<style scoped>
</style>
