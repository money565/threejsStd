<script setup lang="ts">
const currentDate = ref('')
const currentTime = ref('')
let timer: number

function updateTime() {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="dashboard-header w-100%">
    <div class="header-container">
      <div class="title-box">
        <h1 class="main-title">
          细川物业3D数字孪生系统
        </h1>
        <p class="sub-title">
          DIGITAL TWIN INTELLIGENT MANAGEMENT SYSTEM
        </p>
      </div>
      <div class="tech-decoration">
        <div class="circle c1" />
        <div class="circle c2" />
        <div class="circle c3" />
        <div class="line" />
      </div>
      <div class="time-display pr-30">
        <span class="date">{{ currentDate }}</span>
        <span class="time">{{ currentTime }}</span>
      </div>
    </div>
  </div>
</template>

  <style scoped>
  .dashboard-header {
    height: 80px;
    background: linear-gradient(90deg, rgba(11,31,62,0.8) 0%, rgba(20,70,140,0.9) 50%, rgba(11,31,62,0.8) 100%);
    box-shadow: 0 0 20px rgba(0,150,255,0.5);
    position: relative;
    border-bottom: 1px solid rgba(64,158,255,0.3);
  }

  .header-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    position: relative;
    overflow: hidden;
  }

  .title-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    text-align: center;
    flex-grow: 1;
  }

  .main-title {
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 10px rgba(64,158,255,0.8);
    letter-spacing: 2px;
    margin: 0;
    background: linear-gradient(90deg, #fff, #64b5f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
  }

  .sub-title {
    font-size: 14px;
    color: rgba(200,230,255,0.8);
    letter-spacing: 1px;
    margin: 5px 0 0;
    text-shadow: 0 0 5px rgba(64,158,255,0.5);
  }

  .tech-decoration {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(1px);
    opacity: 0.6;
  }

  .circle.c1 {
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(64,158,255,0.8) 0%, rgba(64,158,255,0) 70%);
    top: -50px;
    left: 10%;
    animation: float 8s infinite ease-in-out;
  }

  .circle.c2 {
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(100,181,246,0.6) 0%, rgba(100,181,246,0) 70%);
    bottom: -75px;
    right: 15%;
    animation: float 10s infinite ease-in-out reverse;
  }

  .circle.c3 {
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(30,136,229,0.7) 0%, rgba(30,136,229,0) 70%);
    top: 50%;
    left: 80%;
    transform: translateY(-50%);
    animation: float 7s infinite ease-in-out 2s;
  }

  .line {
    position: absolute;
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent, rgba(64,158,255,0.5), transparent);
    top: 50%;
    box-shadow: 0 0 5px rgba(64,158,255,0.3);
  }

  .time-display {
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 2;
    color: #e3f2fd;
    font-family: 'Arial', sans-serif;
  }

  .time-display .date {
    font-size: 14px;
    margin-bottom: 3px;
    opacity: 0.8;
  }

  .time-display .time {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 1px;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-20px) translateX(10px);
    }
  }

  /* 响应式调整 */
  @media (max-width: 1200px) {
    .main-title {
      font-size: 24px;
    }

    .sub-title {
      font-size: 12px;
    }
  }
  </style>
