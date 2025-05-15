<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import right3 from './right3.vue'
import right4 from './right4.vue'

const acs = useAppCacheStore()
</script>

<template>
  <div>
    <div class="relative w-100% h-183 bg-transparent overflow-hidden mt-3">
      <!-- 内发光层 -->
      <div class="absolute inset-0 shadow-[inset_0_0_10px_2px_rgba(56,182,255,0.5)]" />

      <!-- 边缘高光线 -->
      <div class="absolute inset-0 rounded-lg border border-cyan-400/20 pointer-events-none" />

      <!-- 内容 -->
      <div class="z-10 h-183 w-100% flex flex-col bg-blue-500 bg-opacity-30">
        <div class="flex w-100% h-9  text-white text-center justify-center pt-1 bg-[linear-gradient(to_right,rgba(59,130,246,0.9),transparent)] backdrop-blur-sm">
          参数和巡检
        </div>

        <div class="text-center text-white">
          <h3>巡检信息</h3>
        </div>
        <div class="flex">
          <right3 />
        </div>
        <div class="text-center text-white">
          <h3 v-if="acs.allOverView">
            变压器主要参数
          </h3>
          <h3 v-else>
            变压器详细参数
          </h3>
        </div>
        <div class="flex h-60 mt--2">
          <right4 />
        </div>
        <!-- 内容区 -->
      </div>
    </div>
  </div>
</template>

  <style>

  </style>
