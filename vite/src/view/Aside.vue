<script setup>
import {ref} from "vue";
import GetJsonFromPaifuUrl from "@/components/GetJsonFromPaifuUrl.vue";
import LoginToMajSoul from "@/components/LoginToMajSoul.vue";

const activeNames = ref(['login', 'paifu'])
</script>

<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="login" title="登录">
      <LoginToMajSoul/>
    </el-collapse-item>
    <el-collapse-item name="paifu" title="牌谱">
      <GetJsonFromPaifuUrl/>
    </el-collapse-item>
  </el-collapse>

</template>

<style scoped>

</style>