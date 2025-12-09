<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

interface Props {
  size?: number // 图表大小（像素）
  colors?: string[] // 水球颜色
  showLabel?: boolean // 是否显示百分比标签
}
const props = withDefaults(defineProps<Props>(), {
  size: 480,
  colors: () => ['#294D99', '#156ACF', '#1598F2'],
  showLabel: true,
})
const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null
const colors = [
  ['#FF6B6B', '#FF8E53'],
  ['#4ECDC4', '#44A08D'],
  ['#C7F464', '#4ECDC4'],
  ['#FFD166', '#FFA166'],
]
const option = ref({
  grid: {
    left: '0%', // 距离容器左侧的距离
    right: '0%', // 距离容器右侧的距离
    top: '15%', // 距离容器顶部的距离
    bottom: '0%', // 距离容器底部的距离
    containLabel: true, // 是否包含坐标轴的标签
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: acs.canBeClickedItem,
    axisLabel: {
      show: true,
      color: '#ffffff', // 只显示标签文字
    },
    axisLine: {
      show: false, // 隐藏X轴线
    },
    axisTick: {
      show: false, // 隐藏X轴刻度
    },
    splitLine: {
      show: false, // 隐藏网格线
    },
  },
  yAxis: {
    type: 'value',
    show: false, // 完全隐藏Y轴
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
  series: [
    {
      name: '最大值',
      data: acs.allItemDatas.amt.max,
      type: 'bar',
      barGap: '-100%', // 关键：让这个系列覆盖在其他系列上
      z: 1,
      barWidth: '50%',
      itemStyle: {
        color() {
        // 为每个柱子创建不同的渐变
          return {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0, // 水平渐变
            colorStops: [{
              offset: 0,
              color: colors[0][0],
            }, {
              offset: 1,
              color: colors[0][1],
            }],
          }
        },
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 12,
        shadowOffsetX: 3, // 横向阴影，模拟3D效果
        shadowOffsetY: 3,
        borderRadius: [3, 3, 0, 0],
      },
    },
    {
      name: '当前值',
      // 生成随机数据，范围在30-100之间
      data: acs.allItemDatas.amt.cur,
      type: 'bar',
      z: 2,
      barWidth: '50%',
      itemStyle: {
        color() {
        // 为每个柱子创建不同的渐变
          return {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0, // 水平渐变
            colorStops: [{
              offset: 0,
              color: colors[3][0],
            }, {
              offset: 1,
              color: colors[3][1],
            }],
          }
        },
        shadowColor: 'rgba(100, 100, 100, 0.3)',
        shadowBlur: 12,
        shadowOffsetX: 2, // 横向阴影，模拟3D效果
        shadowOffsetY: 0,
      },
    },
    {
      name: '差值',
      // 生成随机数据，范围在30-100之间
      data: acs.allItemDatas.amt.dif,
      type: 'bar',
      z: 3,
      barWidth: '50%',
      itemStyle: {
        color() {
        // 为每个柱子创建不同的渐变
          return {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0, // 水平渐变
            colorStops: [{
              offset: 0,
              color: colors[2][0],
            }, {
              offset: 1,
              color: colors[2][1],
            }],
          }
        },
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 12,
        shadowOffsetX: 2, // 横向阴影，模拟3D效果
        shadowOffsetY: 0,
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
  option.value.series[0].data = acs.allItemDatas.amt.max
  option.value.series[1].data = acs.allItemDatas.amt.cur
  option.value.series[2].data = acs.allItemDatas.amt.dif
  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="water-ball-chart" />
</template>

<style scoped>
.water-ball-chart {
  width: v-bind('`${props.size}px`');
  height: v-bind('`${props.size * 0.45}px`');
  margin: 0 auto;
}
</style>
