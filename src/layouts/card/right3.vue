<script setup lang="ts">
// 原始字符数组
const chars = ['10:28分xxx对1t进行了手机巡检，结果为正常', '10:38分xxx对2t进行了手机巡检，结果为正常', '11:38分xxx对3t进行了手机巡检，结果为正常', 'c', 'd', 'e', 'f', 'g', 'h', 'l', 'k', 'q', 'w', 'e']

// 渲染数组：如果内容超出，复制一份用于首尾衔接
const fullList = ref<string[]>([])

// 单个 item 高度，单位 px（需与 CSS 一致）
const itemHeight = 32
const totalItems = chars.length

// DOM refs
const scrollRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

// 状态控制
const translateY = ref(0)
const isTransitioning = ref(true)
const enableScroll = ref(false)

let intervalId: any = null
let scrollResumeTimer: any = null

function startScrolling() {
  intervalId = setInterval(() => {
    if (!enableScroll.value)
      return

    isTransitioning.value = true
    translateY.value += itemHeight

    if (translateY.value >= totalItems * itemHeight) {
      // 重置滚动
      setTimeout(() => {
        isTransitioning.value = false
        translateY.value = 0
      }, 500)
    }
  }, 1500)
}

function stopScrolling() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function onWheel(e: WheelEvent) {
  if (!enableScroll.value)
    return

  e.preventDefault()
  stopScrolling()

  if (e.deltaY > 0) {
    manualScrollDown()
  }
  else {
    manualScrollUp()
  }

  // 3 秒后恢复自动滚动
  if (scrollResumeTimer)
    clearTimeout(scrollResumeTimer)
  scrollResumeTimer = setTimeout(startScrolling, 3000)
}

function manualScrollDown() {
  isTransitioning.value = true
  translateY.value += itemHeight

  if (translateY.value >= totalItems * itemHeight) {
    setTimeout(() => {
      isTransitioning.value = false
      translateY.value = 0
    }, 500)
  }
}

function manualScrollUp() {
  if (translateY.value === 0) {
    // 切到复制段尾部后回滚
    isTransitioning.value = false
    translateY.value = totalItems * itemHeight
    setTimeout(() => {
      isTransitioning.value = true
      translateY.value -= itemHeight
    }, 20)
  }
  else {
    isTransitioning.value = true
    translateY.value -= itemHeight
  }
}

onMounted(() => {
  const container = containerRef.value
  const needsScroll = chars.length * itemHeight > (container?.clientHeight || 0)

  enableScroll.value = needsScroll
  fullList.value = needsScroll ? [...chars, ...chars] : [...chars]

  if (needsScroll)
    startScrolling()
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative overflow-hidden h-80 w-95% border border-gray-300 rounded ml-2"
    @wheel.prevent="onWheel"
  >
    <div
      ref="scrollRef"
      class="absolute left-0 w-full flex flex-col items-center"
      :style="{
        transform: `translateY(-${translateY}px)`,
        transition: isTransitioning ? 'transform 0.5s linear' : 'none',
      }"
    >
      <div
        v-for="(char, i) in fullList"
        :key="i"
        style="color: #FFFAFA"
        class=" flex text-left "
      >
        {{ char }}
      </div>
    </div>
  </div>
</template>
