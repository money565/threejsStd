<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import * as echarts from 'echarts'

const acs = useAppCacheStore()
// 定义图表 DOM 引用
const chartRef = ref<HTMLElement | null>(null)
// 定义图表实例
let chartInstance: echarts.ECharts | null = null
const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        color: 'rgb(255,255,255,0.3)',
      },
    },
  },
  legend: {
    icon: 'rect',
    show: true,
    top: '0%',
    right: '5%',
    itemWidth: 11, // 图例标记的图形宽度。
    itemHeight: 7, //  图例标记的图形高度。
    textStyle: {
      color: '#fff',
      fontSize: 12,
      padding: [0, 5, 0, 5],
    },
  },
  grid: {
    left: '2%',
    right: '2%',
    top: '0%',
    bottom: '0%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        // 坐标轴轴线相关设置。数学上的x轴
        show: true,
        lineStyle: {
          color: 'rgba(1, 58, 116,1)',
        },
      },
      axisLabel: {
        // 坐标轴刻度标签的相关设置
        textStyle: {
          color: '#FFFFFF',
          fontSize: 12,
        },
      },
      splitLine: {
        show: false,
        type: 'dashed',
        lineStyle: {
          color: 'rgba(1, 58, 116,1)',
        },
      },

      axisTick: {
        show: false,
      },
      data: [''],
    },
  ],
  yAxis: [
    {
      name: 'V',
      nameTextStyle: {
        color: 'white',
        fontSize: 12,
        padding: [0, 0, 0, -20],
      },
      // minInterval: 1,
      type: 'value',
      splitLine: {
        show: false,
        lineStyle: {
          color: '#1160a0',
          type: 'dashed',
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(1, 58, 116,1)',
        },
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
      },
      axisTick: {
        show: false,
      },
      min: 210,
      // 最大刻度值
      max: 450,
    },
  ],
  series: [
    {
      name: 'A项电压',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: '#1E90FF', // 线条颜色
        },
      },
      itemStyle: {
        normal: {
          color: '#1E90FF', // 拐点颜色
          // borderColor: '#fff600',//拐点边框颜色
          // borderWidth: 13//拐点边框大小
          label: {
            show: false, // 开启显示
            color: '#1E90FF',
            position: 'top', // 在上方显示
            formatter(res: { value: any }) {
              if (res.value) {
                return res.value
              }
              else {
                return 0
              }
            },
          },
        },
      },
      areaStyle: {
        normal: {
          // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#ffba0030',
            },
            {
              offset: 0.6,
              color: '#ffba0020',
            },
            {
              offset: 1,
              color: '#ffba0010',
            },
          ], false),
        },
      },
      data: acs.volteLine[0],
    },
    {
      name: 'B项电压',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: '#00FF00', // 线条颜色
        },
      },
      itemStyle: {
        normal: {
          color: '#00FF00', // 拐点颜色
          // borderColor: '#fff600',//拐点边框颜色
          // borderWidth: 13//拐点边框大小
          label: {
            show: false, // 开启显示
            color: '#fff',
            position: 'top', // 在上方显示
            formatter(res: { value: any }) {
              if (res.value) {
                return res.value
              }
              else {
                return 0
              }
            },
          },
        },
      },
      areaStyle: {
        normal: {
          // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#ffba0030',
            },
            {
              offset: 0.6,
              color: '#ffba0020',
            },
            {
              offset: 1,
              color: '#ffba0010',
            },
          ], false),
        },
      },
      data: acs.volteLine[1],
    },
    {
      name: 'C项电压',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: '#FF00FF', // 线条颜色
        },
      },
      itemStyle: {
        normal: {
          color: '#FF00FF', // 拐点颜色
          // borderColor: '#fff600',//拐点边框颜色
          // borderWidth: 13//拐点边框大小
          label: {
            show: false, // 开启显示
            color: '#fff',
            position: 'top', // 在上方显示
            formatter(res: { value: any }) {
              if (res.value) {
                return res.value
              }
              else {
                return 0
              }
            },
          },
        },
      },
      areaStyle: {
        normal: {
          // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#ffba0030',
            },
            {
              offset: 0.6,
              color: '#ffba0020',
            },
            {
              offset: 1,
              color: '#ffba0010',
            },
          ], false),
        },
      },
      data: acs.volteLine[2],
    },
    {
      name: '平均电压',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          color: '#ffcc00', // 线条颜色
        },
      },
      itemStyle: {
        normal: {
          color: '#ffcc00', // 拐点颜色
          // borderColor: '#fff600',//拐点边框颜色
          // borderWidth: 13//拐点边框大小
          label: {
            show: false, // 开启显示
            color: '#fff',
            position: 'top', // 在上方显示
            formatter(res: { value: any }) {
              if (res.value) {
                return res.value
              }
              else {
                return 0
              }
            },
          },
        },
      },
      areaStyle: {
        normal: {
          // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#00ffa230',
            },
            {
              offset: 0.6,
              color: '#00ffa220',
            },
            {
              offset: 1,
              color: '#00ffa210',
            },
          ], false),
        },
      },
      data: acs.volteLine[3],
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

watch(() => acs.refreshKey, () => {
  option.value.series[0].data = acs.volteLine[0]
  option.value.series[1].data = acs.volteLine[1]
  option.value.series[2].data = acs.volteLine[2]
  option.value.series[3].data = acs.volteLine[3]
  option.value.xAxis[0].data = acs.volteLine[4]
  chartInstance?.setOption(option.value)
})
</script>

<template>
  <div ref="chartRef" class="w-100% h-48 flex mt--5" />
</template>
