<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 10:36:53
 * @LastEditTime: 2023-06-19 14:23:34
 * @LastEditors: NULL 1628069508@qq.com
 * @Description: Analysis server process management
 * @FilePath: \ruoyi-ui\src\views\system\backgroundManage\components\analysis.vue
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-refresh-left" size="mini" @click="restart">重启</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="processList">
      <el-table-column label="Process Name" align="center" prop="name" />
      <el-table-column label="Process" align="center" prop="processName" />
      <el-table-column label="Start Time" align="center" prop="startTime" />
      <el-table-column label="Status" align="center" prop="state">
        <template slot-scope="scope">
          {{ scope.row.state | getStateText }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getProcessInfo, restartProcess } from '@/api/system/processManage.js'
export default {
  name: 'analysis',
  data() {
    return {
      processList: [],
      // 遮罩层
      loading: false,
    }
  },
  created() {
    this.getList();
  },
  mounted() {

  },
  filters: {
    getStateText(state) {
      return state === 0 ? 'Normal' : 'Abnormal';
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    async getList() {
      this.loading = true;
      let res = await getProcessInfo();
      if (res.data.code === 0 && res.data.result.processList) {
        this.processList = res.data.result.processList;
      }
      this.loading = false;
    },
    async restart() {
      this.$modal
        .confirm('Are you sure you want to restart the analysis server?')
        .then(function () {
          return restartProcess();
        })
        .then((res)=>{
          if (res.data.code === 0) {
            this.$modal.msgSuccess("Restarted successfully");
            this.getList();
          } else {
            this.$modal.msgError("Restart failed");
          }
        })
        .catch(() => { });
    }
  },
  beforeDestory() {

  }
}
</script>

<style lang="scss" scoped></style>
