<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import { computed } from 'vue'

interface Props {
  min?: number // 最小温度
  max?: number // 最大温度
  unit?: string // 单位
  size?: number // SVG显示大小
}

const props = withDefaults(defineProps<Props>(), {
  min: -20,
  max: 50,
  unit: '°C',
  size: 90,
})

const acs = useAppCacheStore()
// 生成刻度线
const ticks = computed(() => {
  const range = props.max - props.min
  const step = range <= 30 ? 5 : 10
  const result = []

  for (let i = props.min; i <= props.max; i += step) {
    result.push({ value: i })
  }

  return result
})

// 根据温度值计算Y坐标 (SVG坐标系向下为正)
function getYPosition(temp: number) {
  const range = props.max - props.min
  const normalized = Math.min(Math.max(temp, props.min), props.max)
  const percentage = (normalized - props.min) / range
  return 190 - (percentage * 170) // 190是底部位置，170是汞柱高度
}

// 计算汞柱高度
function getMercuryHeight() {
  let yPos = 0
  if (acs.temperature === '-') {
    yPos = 0
  }
  else {
    yPos = getYPosition(Number(acs.temperature))
  }
  return 200 - yPos - 11 // 11是底部汞球半径
}
</script>

<template>
  <div class="thermometer-svg-container">
    <svg
      :width="size * 1.5"
      :height="size * 1.8"
      viewBox="0 0 120 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 温度计外框 -->
      <rect
        x="45"
        y="10"
        width="30"
        height="180"
        rx="15"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="2"
      />

      <!-- 温度计底部圆形 -->
      <circle
        cx="60"
        cy="200"
        r="15"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="2"
      />

      <!-- 刻度线 - 修正了 key 的位置 -->
      <template v-for="(tick, index) in ticks" :key="`tick-${index}`">
        <line
          x1="30"
          :y1="getYPosition(tick.value)"
          x2="45"
          :y2="getYPosition(tick.value)"
          stroke="#FFFFFF"
          stroke-width="1"
        />
        <text
          x="25"
          :y="getYPosition(tick.value) + 4"
          text-anchor="end"
          font-size="10"
          fill="#FFFFFF"
        >
          {{ tick.value }}{{ unit }}
        </text>
      </template>

      <!-- 红色汞柱 -->
      <rect
        x="47"
        :y="getYPosition(acs.temperature === '-' ? 0 : Number(acs.temperature))"
        width="26"
        :height="getMercuryHeight()"
        rx="13"
        fill="#ff4d4f"
      />

      <!-- 底部汞球 -->
      <circle
        cx="60"
        cy="200"
        r="11"
        fill="#ff4d4f"
      />

      <!-- 顶部温度显示 -->
      <rect
        x="80"
        y="80"
        width="60"
        height="30"
        rx="5"
        fill="#f0f0f0"
        stroke="#333"
        stroke-width="1"
      />
      <text
        x="110"
        y="100"
        text-anchor="middle"
        font-size="14"
        font-weight="bold"
        fill="#333"
      >
        {{ acs.temperature }}{{ unit }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.thermometer-svg-container {
  display: inline-block;
  text-align: center;
  margin: 0 auto;
}
</style>
