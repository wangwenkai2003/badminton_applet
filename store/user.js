import { defineStore } from 'pinia'
import { ref } from 'vue'

//用户模块
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (t) => (token.value = t)

    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    const setUser = (obj) => {
      console.log(obj, 'obj')
      user.value = obj
    }
    const getUser = async () => {
      // const res = await userGetInfoService() // 请求获取数据
      // user.value = res.data.data
      // return user
    }
    return { token, setToken, removeToken, setUser, getUser, user }
  },
  {
    persist: true
  }
)
