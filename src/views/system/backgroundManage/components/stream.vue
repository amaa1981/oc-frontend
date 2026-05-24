<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 10:38:18
 * @LastEditTime: 2023-06-19 14:27:50
 * @LastEditors: NULL 1628069508@qq.com
 * @Description: Media server process page
 * @FilePath: \ruoyi-ui\src\views\system\backgroundManage\components\stream.vue
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-refresh-left" size="mini" @click="restart">Restart</el-button>
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
import { getMediaProcessInfo, restartMediaProcess } from '@/api/system/processManage.js'
export default {
  name: 'analysis',
  data() {
    return {
      processList: [],
      // Loading state
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
      let res = await getMediaProcessInfo();
      if (res.data.code === 0 && res.data.result.processList) {
        this.processList = res.data.result.processList;
      }
      this.loading = false;
    },
    async restart() {
      this.$modal
        .confirm('Are you sure you want to restart the analysis server?')
        .then(function () {
          return restartMediaProcess();
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
