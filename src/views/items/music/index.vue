<script setup lang="ts">
interface IProps {
  showPanel: boolean
}
// 歌曲列表类型
interface Song {
  name: string
  url: string
}
const props = withDefaults(defineProps<IProps>(), {
  showPanel: false,
})
// 歌曲列表
const songs: Song[] = [
  { name: '歌曲6', url: '/public/6.mp3' },
  { name: '歌曲1', url: '/public/1.mp3' },
  { name: '歌曲2', url: '/public/2.mp3' },
  { name: '歌曲3', url: '/public/3.mp3' },
  { name: '歌曲4', url: '/public/4.mp3' },
  { name: '歌曲5', url: '/public/5.mp3' },
]

const audio = ref<HTMLAudioElement | null>(null)
const currentSongIndex = ref(0)
const isPlaying = ref(true)

// 当前播放的歌曲
const currentSong = ref<Song>(songs[0])

// 初始化音频元素
onMounted(() => {
  setTimeout(() => {
    audio.value = new Audio()
    setupAudioListeners()
    playNextSong()
  }, 2000)
})

// 清理音频元素
onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value.removeEventListener('ended', playNextSong)
    audio.value = null
  }
})

// 设置音频事件监听
function setupAudioListeners() {
  if (audio.value) {
    audio.value.addEventListener('ended', playNextSong)
  }
}

// 播放/暂停切换
function togglePlay() {
  if (!audio.value)
    return

  if (isPlaying.value) {
    audio.value.pause()
  }
  else {
    playCurrentSong()
  }
  isPlaying.value = !isPlaying.value
}

// 播放当前歌曲
function playCurrentSong() {
  if (!audio.value)
    return

  audio.value.src = currentSong.value.url
  audio.value.play().catch((error) => {
    console.error('播放失败:', error)
    isPlaying.value = false
  })
}

// 播放下一首
function playNextSong() {
  currentSongIndex.value = (currentSongIndex.value + 1) % songs.length
  currentSong.value = songs[currentSongIndex.value]

  if (isPlaying.value) {
    playCurrentSong()
  }
}
</script>

<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div v-show="props.showPanel" div class="fixed bottom--2 left-1/2 transform -translate-x-1/2 w-500px h-30px text-white flex text-center items-center flex  justify-center mb-1">
      <div class="absolute inset-0 rounded-lg  shadow-[inset_0_0_10px_2px_rgba(56,182,255,0.5)]" />

      <!-- 边缘高光线 -->
      <div class="absolute inset-0 rounded-lg border border-cyan-400/20 pointer-events-none" />
      <div class="w-100% pt-1 flex gap-4 items-center justify-center bg-blue-500 bg-opacity-30">
        <div>
          <el-icon size="20">
            <SvgIcon :name="isPlaying ? 'pasue' : 'play'" @click="togglePlay" />
          </el-icon>
        </div>
        <div>
          <el-icon size="20">
            <SvgIcon name="next" @click="playNextSong" />
          </el-icon>
        </div>
      </div>
    </div>
  </transition>
</template>

  <style scoped>

  </style>
