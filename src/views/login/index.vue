<script setup lang="ts">
// import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

const loginRules = reactive<FormRules>({
  account: [
    { required: true, trigger: 'blur', message: '请输入用户名' },
    { min: 3, max: 20, trigger: 'blur', message: '长度在3到20个字符' },
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, max: 20, trigger: 'blur', message: '长度在6到20个字符' },
  ],
})
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  account: '',
  password: '',
})

const route = useRoute()
const router = useRouter()
const useUser = useUserStore()
const submitLoading = ref(false)
const redirect = ref(route.query.redirectPath as string ?? '/')

function handleLogin() {
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value) {
        return
      }
      submitLoading.value = true
      useUser.login().then(() => {
        router.replace(redirect.value)
      }).finally(() => {
        submitLoading.value = false
      })
    }
  })
}
</script>

<template>
  <section class="flex items-stretch min-h-screen text-white">
    <div class="login-bg bg-no-repeat bg-cover w-1/2 hidden items-center lg:flex">
      <div class="w-full px-24 z-10">
        <div class="font-bold text-left text-4xl tracking-wide">
          欢迎使用
        </div>
        <div class="my-4 text-3xl">
          成都细川物业管理有限公司数字孪生系统
        </div>
      </div>
    </div>
    <div
      class="flex text-center w-full px-0 z-0 relative items-center justify-center
       bg-[#161616] md:px-16 lg:w-1/2"
    >
      <div class="login-bg bg-no-repeat absolute inset-0 z-10 lg:hidden">
        <div class="bg-black opacity-60 absolute inset-0 z-0" />
      </div>
      <div class="w-full z-11">
        <div class="flex items-center justify-center text-3xl my-6">
          用户登录
        </div>
        <el-form ref="loginFormRef" class="mx-auto w-full px-4 sm:w-2/3 lg:px-0" :model="loginForm" :rules="loginRules">
          <el-form-item prop="account">
            <el-input v-model="loginForm.account">
              <template #prefix>
                <el-icon :size="35">
                  <svg-icon name="user" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" show-password @keyup.enter="handleLogin">
              <template #prefix>
                <el-icon :size="35">
                  <svg-icon name="password" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-button class="w-full" type="primary" size="large" :loading="submitLoading" @click="handleLogin">
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login-bg{
    background-image: url('../../assets//images/loginbk.jpg');
}
</style>
