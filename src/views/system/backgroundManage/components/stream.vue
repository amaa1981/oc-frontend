<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 10:38:18
 * @LastEditTime: 2023-06-19 14:27:50
 * @LastEditors: NULL 1628069508@qq.com
 * @Description: 流媒体服务器进程页面
 * @FilePath: \ruoyi-ui\src\views\system\backgroundManage\components\stream.vue
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-refresh-left" size="mini" @click="restart">重启</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="processList">
      <el-table-column label="进程管理名称" align="center" prop="name" />
      <el-table-column label="进程名" align="center" prop="processName" />
      <el-table-column label="启动时间" align="center" prop="startTime" />
      <el-table-column label="状态" align="center" prop="state">
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
      return state === 0 ? '正常' : '异常';
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
        .confirm('是否确认重启分析服务器')
        .then(function () {
          return restartMediaProcess();
        })
        .then((res)=>{
          if (res.data.code === 0) {
            this.$modal.msgSuccess("重启成功");
            this.getList();
          } else {
            this.$modal.msgError("重启失败");
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
