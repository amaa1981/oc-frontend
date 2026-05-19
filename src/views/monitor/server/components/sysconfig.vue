<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 10:36:53
 * @LastEditTime: 2025-05-29 16:58:00
 * @LastEditors: FGJ
 * @Description:java系统配置信息
 * @FilePath: \ruoyi-ui\src\views\monitor\server\components\analysis.vue
-->
<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <span><i class="el-icon-monitor"></i> {{ $t("sysconfig.title") }}</span>
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh-left"
          class="right-btn"
          size="mini"
          v-if="!isWindows"
          @click="restart"
          >{{ $t("serverInfo.restart") }}</el-button
        >
      </div>
      <div class="el-table el-table--enable-row-hover el-table--medium">
        <table cellspacing="0" style="width: 100%" v-loading="loading">
          <thead>
            <tr>
              <th class="el-table__cell is-leaf">
                <div class="cell">{{ $t("sysconfig.javaName") }}</div>
              </th>
              <th class="el-table__cell is-leaf">
                <div class="cell">{{ $t("sysconfig.javaVersion") }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="el-table__cell is-leaf">
                <div class="cell">JAR</div>
              </td>
              <td class="el-table__cell is-leaf">
                <div class="cell">{{ processList.javaVersion }}</div>
              </td>
            </tr>
            <tr>
              <td class="el-table__cell is-leaf">
                <div class="cell">WEB</div>
              </td>
              <td class="el-table__cell is-leaf">
                <div class="cell">{{ processList.webVersion }}</div>
              </td>
            </tr>

            <tr>
              <td class="el-table__cell is-leaf">
                <div class="cell">Algorithm</div>
              </td>
              <td class="el-table__cell is-leaf">
                <div class="cell">{{ processList.algorithmVersion }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getConfig } from "@/api/system/lan.js";
import { reboot } from "@/api/system/processManage.js";
export default {
  name: "analysis",
  data() {
    return {
      processList: {},
      // 遮罩层
      loading: false,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    isWindows() {
      return process.env.VUE_APP_TYPE == 'windows'
    }
  },
  methods: {
    async getList() {
      this.loading = true;
      let res = await getConfig();
      console.log(res.data);

      this.processList = res.data;

      this.loading = false;
    },
    async restart() {
      this.$modal
        .confirm(this.$t("serverInfo.confirmRestart"))
        .then(function () {
          return reboot({});
        })
        .then((res) => {
          if (res.code == 200) {
            this.$modal.msgSuccess(this.$t("serverInfo.restartSuccessfully"));
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
