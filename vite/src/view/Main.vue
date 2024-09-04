<script setup>
import PaifuAnalyze from "@/components/PaifuAnalyze.vue";
import ScoreAmount from "@/components/ScoreAmount.vue";
import {ref} from 'vue'

const activeName = ref('first')
</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="" type="border-card">
    <el-tab-pane label="牌谱详情" name="first">
      <PaifuAnalyze/>
    </el-tab-pane>
    <el-tab-pane label="buff计算" name="second">
      <ScoreAmount/>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>