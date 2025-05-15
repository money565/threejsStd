<script setup lang="ts">
// import { useAppCacheStore } from '@/stores/appCache'
import musicView from '@/views/items/music/index.vue'

const showPanel = ref(false)
// const ac = useAppCacheStore()
</script>

<template>
  <div
    class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-500px h-30px text-white flex text-center items-center flex  justify-center mb-1"
    @mouseenter="showPanel = true"
    @mouseleave="showPanel = false"
  >
    <musicView :show-panel="showPanel" />
    <!-- 内容区 -->
  </div>
</template>

  <style>

  </style>
