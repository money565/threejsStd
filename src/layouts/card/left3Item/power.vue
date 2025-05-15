<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null
const option = computed<echarts.EChartsOption>(() => {
  return {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '5%',
      bottom: '2%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: acs.power.recordTime,
      axisLine: {
        lineStyle: {
          color: 'rgba(74, 101, 122, 1)',
        },
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: 'rgba(74, 101, 122, 0.8)',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '功率 (kW)',
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 12,
        padding: [0, 0, 0, 40],
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(74, 101, 122, 0.2)',
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(74, 101, 122, 0.8)',
        },
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
      },
    },
    series: [{
      name: '能耗',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 0,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(0, 150, 255, 0.8)',
          },
          {
            offset: 1,
            color: 'rgba(0, 50, 150, 0.1)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: acs.power.powerOptValue,
    }],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(0, 150, 255, 0.5)',
        },
      },
      backgroundColor: 'rgba(10, 30, 60, 0.8)',
      borderColor: '#1e90ff',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
      },
    },
    visualMap: {
      show: false,
      dimension: 0,
      pieces: [{
        lte: 6,
        color: 'rgba(0, 150, 255, 0.8)',
      }, {
        gt: 6,
        lte: 12,
        color: 'rgba(0, 200, 255, 0.8)',
      }],
    },
  }
})
// 初始化图表
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

watch(() => acs.power.currentTime, () => {
  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-60 flex" />
</template>
