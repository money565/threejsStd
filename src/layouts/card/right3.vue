<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import { ElScrollbar } from 'element-plus'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const acs = useAppCacheStore()

// 响应式数据
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const contentListRef = ref<HTMLDivElement>()
const scrollSpeed = ref<number>(1)
const isPaused = ref<boolean>(false)
const scrollPosition = ref<number>(0)

// 容器尺寸
const containerHeight = '400px'

// 计算要显示的项目（双倍内容以实现无缝滚动）
const displayedItems = computed(() => {
  return [...acs.checkResult, ...acs.checkResult]
})

// 滚动动画
let animationFrameId: number | null = null
let lastTimestamp: number | null = null

function scrollContent(timestamp: number) {
  if (!scrollbarRef.value || !contentListRef.value || isPaused.value) {
    animationFrameId = requestAnimationFrame(scrollContent)
    return
  }

  if (!lastTimestamp) {
    lastTimestamp = timestamp
  }

  const deltaTime = timestamp - lastTimestamp
  lastTimestamp = timestamp

  // 计算滚动距离（基于速度）
  const scrollAmount = (scrollSpeed.value * deltaTime) / 80

  // 更新滚动位置
  scrollPosition.value += scrollAmount

  const scrollContainer = scrollbarRef.value
  const scrollContentEl = contentListRef.value

  // 获取实际内容高度
  const contentHeight = scrollContentEl.scrollHeight / 2 // 因为我们是双倍内容

  // 如果滚动到一半（原始内容高度），则重置位置以实现无缝滚动
  if (scrollPosition.value >= contentHeight) {
    scrollPosition.value = 0
  }

  // 设置滚动位置
  if (scrollContainer && scrollContainer.setScrollTop) {
    scrollContainer.setScrollTop(scrollPosition.value)
  }

  animationFrameId = requestAnimationFrame(scrollContent)
}

// 开始滚动
function startScrolling() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  lastTimestamp = null
  animationFrameId = requestAnimationFrame(scrollContent)
}

// 切换暂停/继续
function togglePause() {
  isPaused.value = !isPaused.value
  if (!isPaused.value) {
    startScrolling()
  }
}

// 生命周期
onMounted(() => {
  startScrolling()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="container pl-2 pr-2 text-light-50" @mouseenter="togglePause" @mouseleave="togglePause">
    <div class="scroll-container">
      <ElScrollbar
        ref="scrollbarRef"
        :height="containerHeight"
        :always="true"
      >
        <div ref="contentListRef" class="content-list">
          <div
            v-for="(item, index) in displayedItems"
            :key="index"
            class="content-item"
          >
            {{ item }}
          </div>
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<style scoped>

</style>
