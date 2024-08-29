<script setup>
//需要导入ref 和reactive
import {ref} from 'vue'

//ref定义简单属性,reactive定义对象属性
const msg = ref(0)
const uuid = ref('未知')
// const ObjMsg = reactive({
//   msg: '对象属性'
// })
defineProps({
  // msg: String
})
const changeMsg = () => {
  // console.log(process)
  msg.value++
}

</script>

<template>
  <div>
    <el-input v-model="msg" placeholder="输入雀魂牌谱链接"></el-input>
    <el-button type="primary" @click="changeMsg">下载2</el-button>
    <el-text v-model="uuid"></el-text>
  </div>


</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
