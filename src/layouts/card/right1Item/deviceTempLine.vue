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
      left: '2%', // 距离容器左侧的距离
      right: '0%', // 距离容器右侧的距离
      top: '20%', // 距离容器顶部的距离
      bottom: '5%', // 距离容器底部的距离
      containLabel: true, // 是否包含坐标轴的标签
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      textStyle: {
        color: '#fff', // 设置字体颜色为白色
        top: '5%',
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: acs.tempLine[4],
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
      axisLabel: {
        formatter: '{value} °C',
        color: '#ffffff', // 只显示标签文字
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: '环境',
        type: 'line',
        data: acs.tempLine[0],
        itemStyle: {
          color: '#FF6B6B', // 线条颜色
        },
      },
      {
        name: '配电柜',
        type: 'line',
        data: acs.tempLine[1],
        itemStyle: {
          color: '#4ECDC4', // 线条颜色
        },
      },
      {
        name: '设备',
        type: 'line',
        data: acs.tempLine[2],
        itemStyle: {
          color: '#C7F464', // 线条颜色
        },
      },
      {
        name: '差值',
        type: 'line',
        data: acs.tempLine[3],
        itemStyle: {
          color: '#FFD166', // 线条颜色
        },
      },
    ],
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
  chart!.on('click', () => {
    emits('showData')
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

// 监听湿度变化
watch(() => acs.refreshTempLineKey, (newVal, oldVal) => {
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
  height: v-bind('`${props.size * 0.5}px`');
  margin: 0 auto;
}
</style>
