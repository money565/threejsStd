<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null

const xData2 = acs.canBeClickedItem
// const data1 = [0.02, 0.05, 0.12, 0.08, 0.12, 0.1, 0.19, 0.12]
// const data2 = [0.08, 0.15, 0.18, 0.02, 0.08, 0.1, 0.01, 0.18]
// const data3 = [0.1, 0.2, 0.3, 0.1, 0.2, 0.2, 0.2, 0.3]
const bottomCircle = computed(() => {
  const temp = []
  for (let i = 0; i < acs.canBeClickedItem.length; i++) {
    temp.push(1)
  }
  return temp
})
const barTopColor = [
  '#149575',
  '#AE790C',
  '#0E86B1',
  '#4572BA',
  '#30B1AE',
  '#53e568',
  '#02c3f1',
  '#53e568',
]
const barBottomColor = [
  '#33C09D',
  '#F8B82F',
  '#3ED0F2',
  '#74A7F5',
  '#74F4E7',
  '#53e568',
  '#02c3f1',
  '#53e568',
]
const option = ref({
  tooltip: {
    trigger: 'item',
  },
  grid: {
    left: 40,
    bottom: 30,
    top: 40,
    right: 10,
  },
  xAxis: {
    data: xData2,
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      interval: 0,
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      margin: 10, // 刻度标签与轴线之间的距离。
    },
  },
  yAxis: {
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
  },
  series: [
    {
      // 三个最低下的圆片
      name: '',
      type: 'pictorialBar',
      symbolSize: [30, 10],
      symbolOffset: [0, 6],
      z: 20,
      itemStyle: {
        opacity: 1,
        color(params: { dataIndex: number }) {
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: barTopColor[params.dataIndex],
            },
            {
              offset: 0,
              color: barBottomColor[params.dataIndex],
            },
          ])
        },
      },
      data: bottomCircle,
    },

    // 下半截柱状图 //series[1].data = acs.allItemDatas.amt.cur
    {
      name: '当前',
      type: 'bar',
      barWidth: 30,
      barGap: '-100%',
      itemStyle: {
        // lenged文本
        opacity: 0.9,
        color(params: { dataIndex: number }) {
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: barTopColor[params.dataIndex],
            },
            {
              offset: 1,
              color: barBottomColor[params.dataIndex],
            },
          ])
        },
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 14,
        color: '#fff', // 柱状顶部文字颜色
        // formatter(params) {
        //   // return '20%';
        // },
      },
      data: acs.allItemDatas.amt.cur, // data1,
    },
    // series[2].data = acs.allItemDatas.amt.cur
    {
      // 替代柱状图 默认不显示颜色，是最下方柱图（邮件营销）的value值 - 20
      type: 'bar',
      barWidth: 30,
      barGap: '-100%',
      stack: '广告',
      itemStyle: {
        color: 'transparent',
      },
      data: acs.allItemDatas.amt.cur, // data1,
    },
    // series[3].data = acs.allItemDatas.amt.max
    {
      name: '', // 头部
      type: 'pictorialBar',
      symbolSize: [30, 10],
      symbolOffset: [0, -6],
      z: 12,
      symbolPosition: 'end',
      itemStyle: {
        color(params: { dataIndex: number }) {
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: barTopColor[params.dataIndex],
            },
            {
              offset: 0,
              color: barBottomColor[params.dataIndex],
            },
          ])
        },
        opacity: 0.8,
      },
      data: acs.allItemDatas.amt.max, // data3,
    },
    // series[4].data = acs.allItemDatas.amt.cur
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [30, 10],
      symbolOffset: [0, -6],
      z: 12,
      itemStyle: {
        opacity: 1,
        color(params: { dataIndex: number }) {
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: barTopColor[params.dataIndex],
            },
            {
              offset: 0,
              color: barBottomColor[params.dataIndex],
            },
          ])
        },
      },
      symbolPosition: 'end',
      data: acs.allItemDatas.amt.cur, // data1,
    },
    // series[5].data = acs.allItemDatas.amt.dif
    {
      name: '日最大峰值',
      type: 'bar',
      barWidth: 30,
      z: 2,
      barGap: '-100%',
      stack: '广告',
      data: acs.allItemDatas.amt.dif, // data2,
      itemStyle: {
        color(params: { dataIndex: number }) {
          return barTopColor[params.dataIndex]
        },
        opacity: 0.5,
      },
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
  option.value.series[1].data = acs.allItemDatas.amt.cur
  option.value.series[2].data = acs.allItemDatas.amt.cur
  option.value.series[3].data = acs.allItemDatas.amt.max
  option.value.series[4].data = acs.allItemDatas.amt.cur
  option.value.series[5].data = acs.allItemDatas.amt.dif
  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-60" />
</template>
