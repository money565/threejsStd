<script setup lang="ts">
import amtShow from './allOverViews/amtShow.vue'
import powerShow from './allOverViews/powerShow.vue'
import volShow from './allOverViews/volShow.vue'
// import { useUserStore } from '@/stores/user'
// import { publish } from '@/views/items/datas/mqtt'
</script>

<template>
  <div class="relative w-100% h-245 bg-transparent overflow-hidden mt-22">
    <!-- 内发光层 -->
    <div class="absolute inset-0 rounded-lg  shadow-[inset_0_0_10px_2px_rgba(56,182,255,0.5)]" />

    <!-- 边缘高光线 -->
    <div class="absolute inset-0 rounded-lg border border-cyan-400/20 pointer-events-none" />

    <!-- 内容 -->
    <div class="z-10 h-100% w-100% flex flex-col bg-blue-500 bg-opacity-30">
      <div class="w-100% h-10  block text-white text-center justify-center pt-1 bg-[linear-gradient(to_right,rgba(59,130,246,0.9),transparent)] backdrop-blur-sm">
        总览
      </div>
      <!-- 内容区 -->
      <div class="w-100% h-60">
        <div class="text-center font-700 pt-5" style="color:white">
          电压
        </div>
        <volShow />
        <div class="text-center font-700 pt-5" style="color:white">
          电流
        </div>
        <amtShow />
        <div class="text-center font-700 pt-5" style="color:white">
          功率
        </div>
        <powerShow />
      </div>
    </div>
  </div>
</template>

  <style>

  </style>
