<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null
const option = ref({
  legend: {
    icon: 'circle',
    textStyle: {
      fontSize: 14,
      color: 'rgba(255,255,255,.8)',
    },
    data: [{
      name: 'A项电流',
      itemStyle: {
        color: '#1E90FF',
      },
    }, {
      name: 'B项电流',
      itemStyle: {
        color: '#00FF00',
      },
    }, {
      name: 'C项电流',
      itemStyle: {
        color: '#FF00FF',
      },
    }, {
      name: '总电流',
      itemStyle: {
        color: '#ffcc00',
      },
    }],
  },
  grid: {
    top: '15%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff',
    axisPointer: {
      lineStyle: {
        color: '#3763cd', // 显示竖线颜色
        type: 'solid',
      },
    },
    textStyle: {
      color: '#363636',
    },
  },
  xAxis: [
    {
      boundaryGap: false,
      type: 'category',
      axisLine: {
        // 坐标轴轴线相关设置。数学上的x轴
        show: true,
        lineStyle: {
          color: '#485051',
        },
      },
      axisLabel: {
      //   show: true,
      //   interval: 0,
      //   textStyle: {
      //     color: '#fff',
      //     padding: 10,
      //     fontSize: 14,
      //   },
        textStyle: {
          color: '#FFFFFF',
          fontSize: 12,
        },

      },
      axisTick: {
        show: false,
      },
      data: acs.amterLine[4],
    },
  ],
  yAxis: [
    {
      splitLine: {
        show: false,
        lineStyle: {
          color: '#485051',
        },
      },
      axisLine: {
        show: false,

      },
      axisLabel: {

        textStyle: {
          color: '#ffffff',
          padding: 2,
          fontSize: 14,
        },

      },
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      large: true, // 开启大数据优化
      largeThreshold: 500, // 数据量超过1000时启用优化
      name: 'A项电流',
      type: 'line',
      smooth: true,
      showSymbol: false, // 圆点显隐
      lineStyle: {
        normal: {
          width: 2,
          color: '#1E90FF', // 线条颜色
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(44,157,236,0.5)',
            },
            {
              offset: 1,
              color: 'rgba(44,157,236,0)',
            },
          ], false),

        },
      },
      data: acs.amterLine[0],
    },
    {
      large: true, // 开启大数据优化
      largeThreshold: 500, // 数据量超过1000时启用优化
      name: 'B项电流',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: '#00FF00', // 线条颜色
        },
      },

      areaStyle: {

        normal: {

          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(131,225,175,0.5)',
            },
            {
              offset: 1,
              color: 'rgba(131,225,175,0)',
            },
          ], false),

        },
      },
      data: acs.amterLine[1],
    },
    {
      large: true, // 开启大数据优化
      largeThreshold: 500, // 数据量超过1000时启用优化
      name: 'C项电流',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: '#FF00FF', // 线条颜色
        },
      },

      areaStyle: {

        normal: {

          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(131,225,175,0.5)',
            },
            {
              offset: 1,
              color: 'rgba(131,225,175,0)',
            },
          ], false),

        },
      },
      data: acs.amterLine[2],
    },
    {
      large: true, // 开启大数据优化
      largeThreshold: 500, // 数据量超过1000时启用优化
      name: '总电流',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: '#ffcc00', // 线条颜色
        },
      },

      areaStyle: {

        normal: {

          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(131,225,175,0.5)',
            },
            {
              offset: 1,
              color: 'rgba(131,225,175,0)',
            },
          ], false),

        },
      },
      data: acs.amterLine[3],
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

watch(() => acs.refreshAmterLineKey, () => {
  option.value.xAxis[0].data = acs.amterLine[4]
  option.value.series[0].data = acs.amterLine[0]
  option.value.series[1].data = acs.amterLine[1]
  option.value.series[2].data = acs.amterLine[2]
  option.value.series[3].data = acs.amterLine[3]
  chartInstance?.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-58 flex" />
</template>
