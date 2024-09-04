<script setup>
import {inject, ref} from 'vue'
import {paifuActive} from "../store/paifu_json_store.js";
import {paifuJsonLS} from "../store/paifu_json_LS.js";
import {buffTreeData} from "../buffs/buff_tree_data.js";


const url = ref('240819-8c26764a-95f6-4e7a-83c8-338595e87ce2')

const appContext = inject('appContext')
const getJsonToAnalyze = async () => {
  await paifuJsonLS.getItem(paifuJsonLS.formToUuid(url.value)).then(data=>{
    paifuActive.setActive(data.data)
    buffTreeData.form();
    appContext.config.globalProperties.$message(data.msg);
  }).catch(e=>{
    appContext.config.globalProperties.$message(e.msg);
  })
}
const htmlDownload = async () => {
  await paifuJsonLS.htmlDownloadJson(url.value).then(data => {
    appContext.config.globalProperties.$message(data.msg);
  }).catch(e => {
    appContext.config.globalProperties.$message(e.message);
  })
}


</script>

<template>
  <el-input v-model="url" autosize
            type="textarea" placeholder="输入雀魂牌谱链接或id"></el-input>
  <el-button type="primary" @click="htmlDownload">下载</el-button>
  <el-button type="primary" @click="getJsonToAnalyze">概览</el-button>

</template>

<style scoped>

</style>
