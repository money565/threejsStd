<script setup lang="ts">
import { getSpotObjectByProject } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import paramShow from './right4/paramShow.vue'

const acs = useAppCacheStore()
const currentItemParams = ref<number>(-1)
const itemParams = ref<{ name: string, params: { label: string, value: string }[] }[]>([])

onMounted(() => {
  getSpotObjectByProject('2').then(({ data: res }) => {
    if (res.result.length > 0) {
      for (const a in acs.canBeClickedItem) {
        const tids = String(acs.canBeClickedItem[a]).match(/\d+/g)
        let tid: any = null
        if (tids !== null && tids.length > 0) {
          tid = tids[0]
          for (const i in res.result) {
            const ids = String(res.result[i].name).match(/\d+/g)
            if (ids !== null && ids.length > 0) {
              const id = ids[0]
              if (tid === id) {
                itemParams.value.push({
                  name: acs.canBeClickedItem[a],
                  params: res.result[i].parameters,
                })
              }
            }
            else {
              continue
            }
          }
        }
        else {
          continue
        }
      }
    }
  })
})

watch(() => acs.currentItem, () => {
  if (!acs.allOverView) {
    let hasParam = false
    for (const i in itemParams.value) {
      if (acs.currentItem === itemParams.value[i].name) {
        hasParam = true
        currentItemParams.value = Number(i)
      }
    }
    if (hasParam !== true) {
      currentItemParams.value = -1
    }
  }
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
            <div v-if="currentItemParams === -1">
              没有该变压器参数
            </div>
            <div v-else>
              <p v-for="(item, index) in itemParams[currentItemParams!].params" :key="index" class="scrollbar-demo-item">
                <paramShow :psname="item.label" :psparam="item.value" />
              </p>
            </div>
          </transition>
        </div>
      </transition>
    </el-scrollbar>
  </div>
</template>
