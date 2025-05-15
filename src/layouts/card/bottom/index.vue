<script setup lang="ts">
// import { useAppCacheStore } from '@/stores/appCache'
import musicView from '@/views/items/music/index.vue'

// const ac = useAppCacheStore()
</script>

<template>
  <div div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-500px h-30px text-white flex text-center items-center flex  justify-center mb-1">
    <!-- 内发光层 -->
    <div class="absolute inset-0 rounded-lg  shadow-[inset_0_0_10px_2px_rgba(56,182,255,0.5)]" />

    <!-- 边缘高光线 -->
    <div class="absolute inset-0 rounded-lg border border-cyan-400/20 pointer-events-none" />

    <!-- 内容 -->
    <div class="z-10 h-100% w-100% flex flex-col bg-blue-500 bg-opacity-30">
      <musicView />
    <!-- 内容区 -->
    </div>
  </div>
</template>

  <style>

  </style>
