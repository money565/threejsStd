<script setup lang="ts">
import * as echarts from 'echarts'

interface IProps {
  ammName: string
  ammValue: number
}

const props = withDefaults(defineProps<IProps>(), {
  ammName: '电压表',
  ammValue: 0,
})

// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null
const option = computed<echarts.EChartsOption>(() => {
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 90,
        min: 0,
        max: 15,
        center: ['93%', '60%'],
        radius: '150%',
        splitNumber: 3,
        itemStyle: {
          color: '#58D9F9',
          shadowColor: 'rgba(0,138,255,0.45)',
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        progress: {
          show: true,
          roundCap: true,
          width: 7,
        },
        pointer: {
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: '65%',
          width: 16,
          offsetCenter: [0, '5%'],
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 7,
          },
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: '#FFFFFF',
          },
        },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 3,
            color: '#FFFFFF',
          },
        },
        axisLabel: {
          distance: 30,
          color: '#FFFFFF',
          fontSize: 10,
        },
        title: {
          show: true,
          fontSize: 15,
          color: 'white',
          offsetCenter: ['-90%', '-90%'],
        },
        detail: {
          backgroundColor: '#fff',
          borderColor: '#999',
          borderWidth: 2,
          width: '30%',
          lineHeight: 20,
          height: 15,
          fontSize: 20,
          borderRadius: 8,
          offsetCenter: ['-50%', '40%'],
          valueAnimation: true,
          formatter(value) {
            return `${value}`
          },
          rich: {
            value: {
              fontSize: 10,
              fontWeight: 'bolder',
              color: '#999',
            },
          },
        },
        data: [
          {
            value: props.ammValue,
            name: props.ammName,
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

watch(() => props.ammValue, () => {
  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-100% flex" />
</template>
