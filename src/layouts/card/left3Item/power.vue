<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null
const option = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      top: '5%',
      right: '20%',
      itemGap: 20,
      icon: 'circle', //  这个字段控制形状  类型包括 circle 圆形，triangle 三角形，diamond 四边形，arrow 变异三角形，none 无
      itemWidth: 10, // 设置图例图形的宽
      itemHeight: 10, // 设置图例图形的高
      textStyle: {
        color: '#FFFFFF',
        // fontWeight: 'bold'
      },
    },
    grid: {
      left: '1%',
      right: '2%',
      bottom: '5%',
      // top: '10%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: acs.powerLine[2],
        axisLabel: {
          textStyle: {
            color: '#C5D6E6',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#D9E7FF',
          },
        },
        // axisTick: {
        //   show: false // 取消 x 轴刻度
        // }
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitNumber: 4,
        splitLine: {
          lineStyle: {
            color: 'rgba(217, 231, 255, 0.3)',
          },
        },
        axisLabel: {
          textStyle: {
            color: '#C5D6E6',
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#333',
          },
        },
        nameTextStyle: {
          color: '#999',
        },
        splitArea: {
          show: false,
        },
      },
    ],
    // https://www.yuque.com/sxd_panda/antv/x6
    series: [
      {
        large: true, // 开启大数据优化
        largeThreshold: 500, // 数据量超过1000时启用优化
        name: '有功功率',
        type: 'line',
        data: acs.powerLine[0],
        lineStyle: {
          normal: {
            width: 2,
            color: 'rgba(15, 222, 255, 1)',
            shadowColor: 'rgba(72,216,191, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 20,
          },
        },
        areaStyle: {
          normal: {
            // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#0FDEFF',
              },
              {
                offset: 1,
                color: 'rgba(15, 222, 255, 0)',
              },
            ], false),
          },
        },
        // 图例样式
        itemStyle: {
          color: 'rgba(15, 222, 255, 1)',
        },
        smooth: true,
        symbol: 'none', // 设置拐点不显示
      },
      {
        large: true, // 开启大数据优化
        largeThreshold: 500, // 数据量超过1000时启用优化
        name: '无功功率',
        type: 'line',
        data: acs.powerLine[1],
        lineStyle: {
          normal: {
            width: 2,
            color: 'rgba(255, 208, 59, 1)',
          },
        },
        areaStyle: {
          normal: {
            // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(255, 208, 59, 1)',
              },
              {
                offset: 1,
                color: 'rgba(255, 208, 59, 0)',
              },
            ], false),
          },
        },
        // 图例样式
        itemStyle: {
          color: 'rgba(255, 208, 59, 1)',
        },
        smooth: true,
        symbol: 'none', // 设置拐点不显示
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
  option.value.xAxis[0].data = acs.powerLine[2]
  option.value.series[0].data = acs.powerLine[0]
  option.value.series[1].data = acs.powerLine[1]
  chartInstance!.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-70 flex" />
</template>
