<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const props = withDefaults(defineProps<Props>(), {
  size: 400,
  colors: () => ['#294D99', '#156ACF', '#1598F2'],
  showLabel: true,
})

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
  let humidity = acs.humidity
  if (humidity === '-')
    humidity = 0
  else
    humidity = Number(acs.humidity)
  const option: echarts.EChartsOption | any = {
    series: [{
      type: 'liquidFill',
      data: [
        humidity / 100,
        humidity / 100 - 0.1,
        humidity / 100 - 0.15,
      ],
      radius: '90%',
      center: ['50%', '40%'],
      color: props.colors,
      backgroundStyle: {
        color: 'transparent',
        borderColor: '#156ACF',
        borderWidth: 1,
      },
      outline: {
        show: false,
      },
      label: {
        show: props.showLabel,
        position: ['50%', '50%'],
        formatter: `${acs.humidity}%`,
        fontSize: 30,
        color: '#7FFF00',
        fontWeight: 'bold',
      },
      amplitude: 6,
      waveAnimation: true,
      animationDuration: 2000,
      animationDurationUpdate: 800,
      shape: 'circle',
      phase: 0,
      direction: 'right',
      waveLength: '100%',
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
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

// 监听湿度变化
watch(() => acs.humidity, (newVal, oldVal) => {
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
  height: v-bind('`${props.size}px`');
  margin: 0 auto;
}
</style>
