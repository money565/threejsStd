import { STORAGE_PREFIX, USER } from '@/config/chache'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<any>(null)

  const getToken = computed(() => token.value)
  function loginApi() {
    return new Promise((reslove) => {
      setTimeout(() => {
        reslove({
          result: {
            token: '123456789',
            userInfo: {
              clientID: '025111',
              clientName: 'tanghui',
            },
          },
        })
      }, 1000)
    })
  }
  function login() {
    return loginApi().then((res: any) => {
      token.value = res.result.token
      userInfo.value = res.result
    })
  }
  return { token, userInfo, login, getToken }
}, {
  persist: {
    key: `${STORAGE_PREFIX}${USER}`,
    storage: localStorage,
  },
})
