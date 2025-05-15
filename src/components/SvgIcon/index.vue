<script setup lang="ts">
interface Iprops {
  name: string
  perfix?: string
}

const props = withDefaults(defineProps<Iprops>(), {
  perfix: 'icon',
})

const symbolId = computed(() => `#${props.perfix}-${props.name}`)
</script>

<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style scoped>
.svg-icon{
    width:1em;
    height:1em;
    vertical-align: -0.15em;
    fill:currentColor;
    overflow: hidden;
}
</style>
