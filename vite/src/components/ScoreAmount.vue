<script setup>
import {reactive, ref} from "vue";
import {paifuInfo} from "@/store/paifu_info_store.js";
import {buffTreeData} from "../buffs/buff_tree_data.js";
import {paifuProcess} from "../store/paifu_process_store.js";

const cols = reactive([
  {name: 'player', label: '玩家', width: '14'},
  {name: 'point', label: '素点', width: '8'},
  {name: 'field_buff', label: '场地buff', width: '25'},
  {name: 'field_buff_score', label: '场地赋分', width: '10'},
  {name: 'personal_buff', label: '个人buff', width: '25'},
  {name: 'personal_buff_score', label: '个人赋分', width: '10'},
  {name: 'total_score', label: '总分', width: '8'}
])
const info_data = paifuInfo.data
const tree_data = buffTreeData.data
const score_list = ref({field_buff_score: {}, personal_buff_score: {}, total_score: {}})
const active_tables = ['info', 'actions']
const field_buff_value = ref(['0-1-4'])
const detail_mode = ref(false)

const objectSpanMethod = ({column, rowIndex,}) =>
    column.property === 'field_buff' ? !rowIndex ?
        {rowspan: 3, colspan: 1,} : {rowspan: 0, colspan: 0,} : undefined
const countTotalScoreProcess = () => {
  paifuProcess.buildBuffs(field_buff_value.value, info_data.overview_points)
  score_list.value = {...paifuProcess.buildActions()}
  console.log(score_list)
}
</script>

<template>

  <el-collapse :model-value="active_tables">
    <el-collapse-item name="info">
      <template #title>
        <el-text>计算表格</el-text>
        <el-divider direction="vertical"/>
        <el-button @click.stop type="primary" @click="countTotalScoreProcess">计算</el-button>
        <el-divider direction="vertical"/>
        <el-switch
            @click.stop
            v-model="detail_mode"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #13ce66"
            active-text="每局得分"
            inactive-text="总计得分"
        />
      </template>
      <el-table border size="large" :data="info_data.overview_points" :span-method="objectSpanMethod">
        <el-table-column sortable align="center" v-for="col in cols" :prop=col.name :label=col.label
                         :min-width="col.width">
          <template #default="scope" v-if="['player','point'].includes(col.name)">
            {{ scope.row[scope.column.property] }}
          </template>
          <template #default="scope" v-else-if="col.name==='field_buff'">
            <el-tree-select v-model="field_buff_value" :data="tree_data[col.name]" multiple filterable
                            :render-after-expand="false">
              <template #label="label">
                <el-tooltip v-for="item in tree_data[col.name]" :content="label.label" placement="left">
                  {{ label.label }}
                </el-tooltip>
              </template>
            </el-tree-select>
          </template>
          <template #default="scope" v-else-if="col.name==='personal_buff'">
            <el-tree-select v-model="scope.row.buffs" :data="tree_data[col.name]" multiple filterable
                            :render-after-expand="false">
              <template #label="label">
                <el-tooltip v-for="item in tree_data[col.name]" :content="label.label" placement="left">
                  {{ label.label }}
                </el-tooltip>
              </template>
            </el-tree-select>
          </template>
          <template #default="scope" v-else-if="col.name==='total_score'">
            <el-tooltip content="" placement="right">
              <el-text @click="console.log(scope)">
                {{score_list[col.name][scope.row.seat]+scope.row.point}}
              </el-text>
            </el-tooltip>
          </template>
          <template #default="scope" v-else>
            <el-divider></el-divider>
            <div v-for="(buff,i) in score_list[col.name][col.name==='field_buff_score'?0:scope.row.account_id]">
              {{ `buff${i + 1}` }}
              <el-tooltip v-if="detail_mode" v-for="(round,j) in buff.detail" content="" placement="left">
                <el-text class="table-score-text">
                  {{ `第${j + 1}局:${round[scope.row.seat]}` }}
                </el-text>
              </el-tooltip>
              <el-tooltip v-else content="" placement="top">
                <el-text class="table-score-text">
                  {{ buff.sum[scope.row.seat] }}
                </el-text>
              </el-tooltip>
              <el-divider></el-divider>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>

</template>

<style scoped>
.table-score-text {
  display: block;
}
</style>