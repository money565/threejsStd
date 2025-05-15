<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface IProps {
  volName: string
  volValue: number
}

const props = withDefaults(defineProps<IProps>(), {
  volName: '电压表',
  volValue: 0,
})

// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null
const option = computed<echarts.EChartsOption>(() => {
  return { series: [
    {
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      center: ['50%', '50%'],
      radius: '100%',
      min: 210,
      max: 250,
      splitNumber: 3,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.2, '#FDDD60'],
            [0.4, '#7CFFB2'],
            [1, '#58D9F9'],
          ],
        },
      },

      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '30%',
        width: 10,
        offsetCenter: [0, '-45%'],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'red', // 0% 处的颜色
            }, {
              offset: 1,
              color: 'blue', // 100% 处的颜色
            }],
          },
        },

      },
      axisTick: {
        length: 4,
        lineStyle: {
          color: '#FFFFFF',
          width: 2,
        },
      },
      splitLine: {
        length: 6,
        lineStyle: {
          color: '#FFFFFF',
          width: 5,
        },
      },
      axisLabel: {
        color: '#FFFFFF',
        fontSize: 10,
        distance: 20,
        rotate: 'tangential',
        formatter(value: number) {
          if (value === 200) {
            return '低'
          }
          else if (value === 215) {
            return '正常'
          }
          else if (value === 230) {
            return '高'
          }
          return ''
        },
      },
      title: {
        offsetCenter: [0, '-10%'],
        fontSize: 15,
        color: 'white',
      },
      detail: {
        fontSize: 20,
        offsetCenter: [0, '60%'],
        valueAnimation: true,
        formatter(value: number) {
          return `${value}`
        },
        color: 'inherit',
      },
      data: [
        {
          value: props.volValue,
          name: props.volName,
        },
      ],
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

watch(() => props.volValue, () => {
  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-100% flex" />
</template>
