<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import Power from './left3Item/power.vue'
import mesgView from './right2Item/mesg.vue'

const acs = useAppCacheStore()
const pfValue = computed(() => {
  if (acs.itemPF > 1) {
    return 1
  }
  return acs.itemPF.toFixed(3)
})
</script>

<template>
  <div class="relative w-100% h-80 bg-transparent overflow-hidden mt-3">
    <!-- 内发光层 -->
    <div class="absolute inset-0 shadow-[inset_0_0_10px_2px_rgba(56,182,255,0.5)]" />

    <!-- 边缘高光线 -->
    <div class="absolute inset-0 rounded-lg border border-cyan-400/20 pointer-events-none" />

    <!-- 内容 -->
    <div class="z-10 h-100% w-100% flex flex-col items-center justify-center bg-blue-500 bg-opacity-30">
      <div class="w-100% h-20  block text-white text-center justify-center pt-1 bg-[linear-gradient(to_right,rgba(59,130,246,0.9),transparent)] backdrop-blur-sm">
        功率
      </div>
      <div class="flex w-100% h-5 justify-end mb-5 mr-3">
        <h4 class="text-white">
          PF:
        </h4>
        <mesgView class="ml-5 mt-6" />
        <h4 class="text-white ml-5">
          {{ pfValue }}
        </h4>
      </div>
      <div class="flex text-light-50 flex w-100% h-180 block">
        <Power />
      </div>
    <!-- 内容区 -->
    </div>
  </div>
</template>

  <style>

  </style>
