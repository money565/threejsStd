<script setup lang="ts">
import { getSpotObjectByIntelName } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import paramShow from './right4/paramShow.vue'

const acs = useAppCacheStore()
const itemParams = ref<{ name: string, params: { label: string, value: string }[] }>()

watch(() => acs.currentItem, (n) => {
  getSpotObjectByIntelName(n).then(({ data: res }) => {
    itemParams.value = res.result
  })
})
</script>

<template>
  <div class="w-100% ml-3 text-white">
    <el-scrollbar max-height="200px">
      <transition
        mode="out-in"
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="acs.currentItem === '-'">
          选择变压器显示参数
        </div>
        <div v-else>
          <transition
            mode="out-in"
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-if="itemParams === undefined">
              没有该变压器参数
            </div>
            <div v-else>
              <p v-for="(item, index) in itemParams.params" :key="index" class="scrollbar-demo-item">
                <paramShow :psname="item.label" :psparam="item.value" />
              </p>
            </div>
          </transition>
        </div>
      </transition>
    </el-scrollbar>
  </div>
</template>
