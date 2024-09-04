<script setup>
import {reactive, ref} from "vue";
import {paifuInfo} from "@/store/paifu_info_store.js";

const data = paifuInfo.data
const cols = reactive([{name: 'key', label: '参数'}, {name: 'value', label: '值'}, {name: 'etc', label: '备注'}])
const active_tables = ref(['info', 'actions'])
</script>

<template>

  <el-collapse :model-value="active_tables">
    <el-collapse-item name="info" title="对局概览">
      <el-table border :data="data.overview" >
        <el-table-column align="center" v-for="col in cols" :prop=col.name :label=col.label />
      </el-table>
    </el-collapse-item>
    <el-collapse-item name="actions" title="对局详情">
      <el-table></el-table>
    </el-collapse-item>
  </el-collapse>

</template>

<style scoped>

</style>