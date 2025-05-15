<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null
// interface Transformer {
//   currentLoad: number // 当前功率 kW
//   maxLoad: number // 最大功率 kW
//   pf: number
// }
// const transformers: Transformer[] = [
//   { currentLoad: 10, maxLoad: 500, pf: 0.992 },
//   { currentLoad: 250, maxLoad: 400, pf: 0.992 },
//   { currentLoad: 450, maxLoad: 600, pf: 0.992 },
//   { currentLoad: 100, maxLoad: 300, pf: 0.992 },
//   { currentLoad: 350, maxLoad: 500, pf: 0.992 },
//   { currentLoad: 180, maxLoad: 400, pf: 0.992 },
//   { currentLoad: 220, maxLoad: 350, pf: 0.992 },
//   { currentLoad: 150, maxLoad: 300, pf: 0.992 },
// ]
const names = acs.canBeClickedItem
const barValues = computed(() => {
  return acs.allItemDatas.power.map(t => +(t.currentLoad / t.maxLoad * 100).toFixed(1))
})
const labelValues = computed(() => {
  return acs.allItemDatas.power.map(t => `${t.currentLoad} kW`)
})

const option = ref({
  tooltip: {
    trigger: 'item',
    formatter(params: any) {
      const i = params.dataIndex
      const item = computed(() => {
        return acs.allItemDatas.power[i]
      })
      return `
      <strong>${names[params.dataIndex]}</strong><br/>
      当前功率: ${item.value.currentLoad} kW<br/>
      功率因数 (PF): ${item.value.pf}
    `
    },
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    textStyle: {
      color: '#333',
      fontSize: 14,
    },
    extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);',
  },
  grid: {
    left: 20,
    right: 60,
    top: 20,
    bottom: 20,
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    max: 100,
    axisLabel: { show: false },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'category',
    inverse: true,
    data: names,
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: {
      fontSize: 14,
      color: '#fff',
      margin: 10,
    },
  },
  series: [
  // 背景条
    {
      type: 'bar',
      data: Array.from({ length: acs.allItemDatas.power.length }).fill(100),
      barWidth: 24,
      barGap: '-100%', // 🔑 关键：和下面的血条重叠
      itemStyle: {
        color: 'rgba(224, 224, 224, 0.2)',
        borderRadius: 12,
      },
      silent: true,
      z: 1,
    },
    // 血条（当前值）
    {
      type: 'bar',
      data: barValues, // 百分比
      barWidth: 24,
      barGap: '-100%', // 🔑 关键：和背景条重叠
      itemStyle: {
        borderRadius: 12,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#6fbfff' },
            { offset: 0.5, color: '#3f9bff' },
            { offset: 1, color: '#157eff' },
          ],
        },
      },
      label: {
        show: true,
        position: 'insideLeft',
        formatter: (params: any) => labelValues.value[params.dataIndex],
        color: '#fff',
        fontSize: 12,
      },
      z: 2,
    },
    // 百分比文字
    {
      type: 'bar',
      data: Array.from({ length: acs.allItemDatas.power.length }).fill(100),
      barWidth: 24,
      barGap: '-100%',
      itemStyle: {
        color: 'transparent',
      },
      label: {
        show: true,
        position: 'right',
        formatter: (params: any) => {
          const p = (acs.allItemDatas.power[params.dataIndex].currentLoad / acs.allItemDatas.power[params.dataIndex].maxLoad * 100).toFixed(1)
          return `${p}%`
        },
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
      },
      z: 20,
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
  option.value = {
    tooltip: {
      trigger: 'item',
      formatter(params: any) {
        const i = params.dataIndex
        const item = computed(() => {
          return acs.allItemDatas.power[i]
        })
        return `
      <strong>${names[params.dataIndex]}</strong><br/>
      当前功率: ${item.value.currentLoad} kW<br/>
      功率因数 (PF): ${item.value.pf}
    `
      },
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 14,
      },
      extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);',
    },
    grid: {
      left: 20,
      right: 60,
      top: 20,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: names,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        fontSize: 14,
        color: '#fff',
        margin: 10,
      },
    },
    series: [
      // 背景条
      {
        type: 'bar',
        data: Array.from({ length: acs.allItemDatas.power.length }).fill(100),
        barWidth: 24,
        barGap: '-100%', // 🔑 关键：和下面的血条重叠
        itemStyle: {
          color: 'rgba(224, 224, 224, 0.2)',
          borderRadius: 12,
        },
        silent: true,
        z: 1,
      },
      // 血条（当前值）
      {
        type: 'bar',
        data: barValues, // 百分比
        barWidth: 24,
        barGap: '-100%', // 🔑 关键：和背景条重叠
        itemStyle: {
          borderRadius: 12,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#6fbfff' },
              { offset: 0.5, color: '#3f9bff' },
              { offset: 1, color: '#157eff' },
            ],
          },
        },
        label: {
          show: true,
          position: 'insideLeft',
          formatter: (params: any) => labelValues.value[params.dataIndex],
          color: '#fff',
          fontSize: 12,
        },
        z: 2,
      },
      // 百分比文字
      {
        type: 'bar',
        data: Array.from({ length: acs.allItemDatas.power.length }).fill(100),
        barWidth: 24,
        barGap: '-100%',
        itemStyle: {
          color: 'transparent',
        },
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => {
            const p = (acs.allItemDatas.power[params.dataIndex].currentLoad / acs.allItemDatas.power[params.dataIndex].maxLoad * 100).toFixed(1)
            return `${p}%`
          },
          color: 'white',
          fontSize: 14,
          fontWeight: 'bold',
        },
        z: 20,
      },
    ],
  }
  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-80" />
</template>
