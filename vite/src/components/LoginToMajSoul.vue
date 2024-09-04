<script setup>
import {inject, reactive, ref} from 'vue'
import {majSoulPost} from "../utils/axios_utils.js";

const appContext = inject('appContext')
const userInfo = reactive({
  username: '',
  password: ''
})
const isLogin = ref()
const switchLoginStatus = async (code) => {
  await majSoulPost({
    code: code,
    userInfo: userInfo
  }).then(res => {
    appContext.config.globalProperties.$message(res.data.msg)
    isLogin.value = res.data.login;
  }).catch(e => {
    appContext.config.globalProperties.$message(e.stack)
  })

}
// onMounted(()=>{
//   switchLoginStatus(true)
// })
</script>

<template>
  <el-form>
    <el-input v-model="userInfo.username" type="password" autosize placeholder="账号(明文)"></el-input>
    <el-input v-model="userInfo.password" type="password" autosize show-password
              placeholder="密码(密文)"></el-input>
    <el-button type="primary"
               @click="switchLoginStatus(true)">{{ isLogin ? "更换账号" : "登录" }}
    </el-button>
    <el-button type="primary" :disabled="!isLogin"
               @click="switchLoginStatus(false)">注销
    </el-button>
  </el-form>
</template>

<style scoped>

</style>
