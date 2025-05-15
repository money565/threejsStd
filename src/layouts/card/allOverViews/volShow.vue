<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null

function getBarColor(value: number) {
  if (value < 370 || value > 400) {
    return {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: '#FF4C4C' },
        { offset: 1, color: '#FFB6B6' },
      ],
    }
  }
  else if ((value >= 370 && value <= 375) || (value >= 390 && value <= 400)) {
    return {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: '#FFD700' },
        { offset: 1, color: '#FFFACD' },
      ],
    }
  }
  else {
    return {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: '#4CAF50' },
        { offset: 1, color: '#A5D6A7' },
      ],
    }
  }
}

const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: (params: any) => {
      const val = params[0].value
      return `${params[0].name}: <b style="color:${val < 370 || val > 400 ? '#f00' : val > 390 ? '#ffa500' : '#0f0'}">${val}V</b>`
    },
  },
  grid: {
    left: '1%',
    right: '1%',
    bottom: '5%',
    top: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: acs.canBeClickedItem,
    axisTick: { alignWithLabel: true },
    axisLabel: { color: '#fff' },
    axisLine: {
      show: true, // ✅ 不显示横线
    },
  },
  yAxis: {
    type: 'value',
    min: 150,
    max: 420,
    axisLabel: {
      formatter: '{value}',
      color: '#fff',
    },
    splitLine: {
      show: false,
    },
  },
  series: [
    {
      name: '电压',
      type: 'bar',
      barWidth: '60%',
      data: acs.allItemDatas.vol.map((v: number) => ({
        value: v,
        itemStyle: {
          color: getBarColor(v),
          borderRadius: [4, 4, 0, 0],
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.4)',
        },
      })),
    },
  ],
})

function initChart() {
  if (!chartRef.value)
    return
  // 初始化 ECharts 实例
  chartInstance = echarts.init(chartRef.value)
  // 设置图表配置
  chartInstance.setOption(option.value)
  // 响应式调整
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
function handleResize() {
  chartInstance?.resize()
}

// 组件挂载时初始化图表
onMounted(() => {
  initChart()
})

// 组件卸载前清理
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

watch(() => acs.allItemDatas.refresh, () => {
  option.value.series[0].data = acs.allItemDatas.vol.map((v: number) => ({
    value: v,
    itemStyle: {
      color: getBarColor(v),
      borderRadius: [4, 4, 0, 0],
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.4)',
    },
  }))

  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-60" />
</template>
