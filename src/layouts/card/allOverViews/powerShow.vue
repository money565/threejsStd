<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null

const option = computed<any>(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params: { axisValue: string, dataIndex: number }[]) {
        return `
      <div style="font-weight:bold">${params[0].axisValue}</div>
      <div>功率：${acs.allItemDatas.power[params[0].dataIndex].currentLoad}</div>
      <div>PF：${(acs.allItemDatas.power[params[0].dataIndex].pf || 0)}</div>
    `
      },
    },
    grid: {
      left: '3%',
      right: '20%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'category',
      data: acs.canBeClickedItem,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#fff',
        fontSize: 14,
        margin: 20,
      },
    },
    series: [
    // 灰色血槽背景
      {
        type: 'bar',
        barWidth: 20,
        barGap: '-100%',
        data: acs.powerMaxShow,
        itemStyle: {
          color: 'rgb(255,255,255,0.2)',
          borderRadius: [0, 10, 10, 0],
        },
        label: {
          show: true,
          position: 'right',
          formatter(params: { dataIndex: string | number }) {
          // 右侧显示百分比
            return `${acs.powerCurrentPercentShow[Number(params.dataIndex)]}%`
          },
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
          offset: [30, 0],
        },
      },
      // 渐变蓝色血条
      {
        type: 'bar',
        barWidth: 20,
        data: acs.powerCurrentPercentShow,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 0,
              color: '#5B8FF9', // 浅蓝色
            }, {
              offset: 1,
              color: '#1A5DFF', // 深蓝色
            }],
          },
          borderRadius: [0, 10, 10, 0],
        },
        label: {
          show: true,
          position: 'insideLeft',
          formatter(params: { dataIndex: string | number }) {
            // 右侧显示值
            return `${acs.powerCurrentValueShow[Number(params.dataIndex)]}W`
          },
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
          offset: [20, 0], // 向右偏移10像素
        },
      },
    ],
  }
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
  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-80" />
</template>
