<script setup>
import {getCurrentInstance, provide} from 'vue'
import Main from "@/view/Main.vue";
import Aside from "./view/Aside.vue";

const {appContext} = getCurrentInstance()
provide('appContext', appContext)
</script>

<template>
  <el-container  class="app-container">
    <el-aside width="150px">
      <el-scrollbar>
        <Aside/>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-main>
          <Main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-container{
  height: 100%;
  border: 3px solid var(--el-border-color);
}
</style>