<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const props = withDefaults(defineProps<Props>(), {
  size: 380,
  colors: () => ['#294D99', '#156ACF', '#1598F2'],
  showLabel: true,
})

const emits = defineEmits(['showData'])
const acs = useAppCacheStore()
interface Props {
  size?: number // 图表大小（像素）
  colors?: string[] // 水球颜色
  showLabel?: boolean // 是否显示百分比标签
}

const chartContainer = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

// 初始化图表
function initChart() {
  if (!chartContainer.value)
    return

  chart = echarts.init(chartContainer.value)
  updateChart()
}

// 更新图表
function updateChart() {
  if (!chart)
    return
  const option: echarts.EChartsOption | any = {
    grid: {
      left: '0%', // 距离容器左侧的距离
      right: '0%', // 距离容器右侧的距离
      top: '15%', // 距离容器顶部的距离
      bottom: '0%', // 距离容器底部的距离
      containLabel: true, // 是否包含坐标轴的标签
    },
    xAxis: {
      type: 'category',
      data: ['环境', '柜', '设备', '差值'],
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
    series: [{
      data: [
        acs.temperature,
        acs.cabinetTemperature,
        acs.deviceTemperature,
        typeof acs.deviceTemperature === 'number' && typeof acs.cabinetTemperature === 'number' ? Number(acs.deviceTemperature - acs.cabinetTemperature).toFixed(1) : '-',
      ],
      type: 'bar',
      label: {
        show: true, // 显示标签
        position: 'top', // 位置：top, insideTop, middle, bottom, inside, outside等
        color: '#FFFFFF', // 文字颜色
        fontSize: 14, // 字体大小
        fontWeight: 'bold', // 字体粗细
        formatter(params: { value: any }) {
          if (params.value === '-') {
            return '无数据'
          }
          return `${params.value}°C`
        },
      },
      barWidth: '60%',
      barCategoryGap: '10%', // 同一系列柱子间的距离为30%
      itemStyle: {
        color(params: { dataIndex: number }) {
        // 为每个柱子创建不同的渐变
          const colors = [
            ['#FF6B6B', '#FF8E53'],
            ['#4ECDC4', '#44A08D'],
            ['#C7F464', '#4ECDC4'],
            ['#FFD166', '#FFA166'],
          ]

          const index = params.dataIndex % colors.length
          return {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0, // 水平渐变
            colorStops: [{
              offset: 0,
              color: colors[index][0],
            }, {
              offset: 1,
              color: colors[index][1],
            }],
          }
        },
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 12,
        shadowOffsetX: 3, // 横向阴影，模拟3D效果
        shadowOffsetY: 3,
        borderRadius: [6, 6, 0, 0],
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          borderColor: '#fff',
          borderWidth: 2,
        },
      },
    }],
  }

  chart.setOption(option)
}

// 响应式调整大小
function handleResize() {
  chart?.resize()
}

// 生命周期钩子
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
  chart!.on('click', (params) => {
    if (params.componentType === 'series' && params.seriesType === 'bar') {
      emits('showData')
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

// 监听湿度变化
watch(() => acs.cabinetTemperature, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    updateChart()
  }
})
</script>

<template>
  <div ref="chartContainer" class="water-ball-chart" />
</template>

<style scoped>
.water-ball-chart {
  width: v-bind('`${props.size}px`');
  height: v-bind('`${props.size * 0.45}px`');
  margin: 0 auto;
}
</style>
