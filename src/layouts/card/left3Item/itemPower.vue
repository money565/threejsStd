<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null

const legend = {
  show: false,
}
const tooltip = {
  show: false,
}
const color = ['#03acd1', '#04cab7']
const innerRingColor = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: color[0], // 0% 处的颜色
    },
    {
      offset: 1,
      color: color[1], // 100% 处的颜色
    },
  ],
  global: false, // 缺省为 false
}

const option = computed<any>(() => {
  return {
    color,
    tooltip,
    legend,
    series: [
      {
        name: '',
        type: 'pie',
        center: ['50%', '50%'], // 圆心的位置
        radius: ['70%', '85%'], // 环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
        avoidLabelOverlap: false, // 做同心圆用到
        clockwise: false, // 顺时针排列
        startAngle: 40, // 起始角度 影响不大
        label: {
          show: true, // false不显示饼图上的标签
          position: 'outside', // inside（在饼图上显示）,outside(默认就会出现引导线) center
          formatter: '{b}{d}%',
          fontSize: 20,
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
        labelLine: {
          show: true,
          lineStyle: {
            width: 4, // 线条变粗
          },
        },

        data: [
          {
            value: acs.power.ap + acs.power.rp,
            name: '负载',
            itemStyle: { color: innerRingColor, opacity: 1 },
          },
          {
            value: acs.power.max - (acs.power.ap + acs.power.rp),
            name: '空载',
            itemStyle: { color: 'rgba(255, 255, 255, 0.2)' },
          },
        ],

        emphasis: {
          scale: true,
          scaleSize: 10,
          label: {
            show: true,
            formatter: (params: { name: string }) => (params.name === '负载' ? `${acs.power.ap + acs.power.rp}W` : `${acs.power.max - (acs.power.ap + acs.power.rp)}W`),
            valueFormatter: (value: number) => value.toFixed(1),
          },
          // 启用鼠标放上去放大效果，这个挺好的
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
      {
        name: '',
        type: 'pie',
        center: ['50%', '50%'], // 圆心的位置
        radius: ['55%', '65%'], // 环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
        avoidLabelOverlap: false, // 做同心圆用到
        clockwise: false, // 顺时针排列
        startAngle: 90, // 起始角度 影响不大

        label: {
          show: true, // false不显示饼图上的标签
          position: 'center', // inside（在饼图上显示）,outside(默认就会出现引导线) center
          formatter: '{c}W',
          fontSize: 30,
          fontWeight: 'bold',
          color: '#BBFFFF',
        },

        data: [
          { value: acs.power.ap, name: '有功' },
          { value: acs.power.rp, name: '无功' },
        ],

        emphasis: {
          scale: true,
          scaleSize: 10,
          label: {
            show: true,
            position: 'right',
            color: '#FFFFFF',
            formatter: (params: { name: string }) => (params.name === '有功' ? `有功${acs.power.ap.toFixed(1)}W` : `无功${acs.power.rp.toFixed(1)}W`),
          },
          // 启用鼠标放上去放大效果，这个挺好的
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
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

watch(() => acs.power.refreshKey, () => {
  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-60 flex" />
</template>
