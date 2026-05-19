<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 10:36:53
 * @LastEditTime: 2023-06-21 15:23:48
 * @LastEditors: NULL 1628069508@qq.com
 * @Description: 分析服务器进程管理页面
 * @FilePath: \ruoyi-ui\src\views\monitor\server\components\analysis.vue
-->
<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <span
          ><i class="el-icon-monitor"></i> {{ $t("serverInfo.title1") }}</span
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh-left"
          class="right-btn"
          size="mini"
          @click="restart"
          >{{ $t("serverInfo.restart") }}</el-button
        >
      </div>
      <div class="el-table el-table--enable-row-hover el-table--medium">
        <table cellspacing="0" style="width: 100%" v-loading="loading">
          <thead>
            <tr>
              <th class="el-table__cell is-leaf">
                <div class="cell">{{ $t("serverInfo.name") }}</div>
              </th>
              <th class="el-table__cell is-leaf">
                <div class="cell">{{ $t("serverInfo.precessName") }}</div>
              </th>
              <th class="el-table__cell is-leaf">
                <div class="cell">{{ $t("serverInfo.startTime") }}</div>
              </th>
              <th class="el-table__cell is-leaf">
                <div class="cell">{{ $t("serverInfo.status") }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in processList" :key="index">
              <td class="el-table__cell is-leaf">
                <div class="cell">{{ item.name }}</div>
              </td>
              <td class="el-table__cell is-leaf">
                <div class="cell">{{ item.processName }}</div>
              </td>
              <td class="el-table__cell is-leaf">
                <div class="cell">{{ item.startTime }}</div>
              </td>
              <td class="el-table__cell is-leaf">
                <div class="cell">
                  <span v-if="item.state === 0">{{
                    $t("serverInfo.normal")
                  }}</span>
                  <span v-else>{{ $t("serverInfo.abnormal") }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getProcessInfo, restartProcess } from "@/api/system/processManage.js";
export default {
  name: "analysis",
  data() {
    return {
      processList: [],
      // 遮罩层
      loading: false,
    };
  },
  created() {
    this.getList();
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
        .confirm(this.$t("serverInfo.confirmRestart"))
        .then(function () {
          return restartProcess();
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.$modal.msgSuccess(this.$t("serverInfo.restartSuccessfully"));
            this.getList();
          } else {
            this.$modal.msgError(this.$t("serverInfo.restartFaily"));
          }
        })
        .catch(() => {});
    },
  },
  beforeDestory() {},
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
}
</style>
