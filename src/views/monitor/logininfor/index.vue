<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item :label="$t('logininfor.ipaddr')" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('logininfor.userName')" prop="userName">
        <el-input
          v-model="queryParams.userName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('logininfor.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_common_status"
            :key="dict.value"
            :label="$t('dict.sys_common_status.' + dict.value)"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('logininfor.dateRange')">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('logininfor.startTime_p')"
          :end-placeholder="$t('logininfor.endTime_p')"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >{{ $t("commonBtn.search") }}</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
          $t("commonBtn.reset")
        }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:logininfor:remove']"
          >{{ $t("commonBtn.remove") }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          v-hasPermi="['monitor:logininfor:remove']"
          >{{ $t("commonBtn.clear") }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-unlock"
          size="mini"
          :disabled="single"
          @click="handleUnlock"
          v-hasPermi="['monitor:logininfor:unlock']"
          >{{ $t("commonBtn.unlock") }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:logininfor:export']"
          >{{ $t("commonBtn.export") }}</el-button
        >
      </el-col> -->
    </el-row>

    <el-table
      ref="tables"
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        :label="$t('logininfor.infoId')"
        align="center"
        prop="infoId"
      />
      <el-table-column
        :label="$t('logininfor.userName')"
        align="center"
        prop="userName"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        :label="$t('logininfor.ipaddr')"
        align="center"
        prop="ipaddr"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('logininfor.loginLocation')"
        align="center"
        prop="loginLocation"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('logininfor.browser')"
        align="center"
        prop="browser"
        :show-overflow-tooltip="true"
      />
      <el-table-column :label="$t('logininfor.os')" align="center" prop="os" />
      <el-table-column
        :label="$t('logininfor.status')"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          {{ $t("dict.sys_common_status." + scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('logininfor.msg')"
        align="center"
        prop="msg"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('logininfor.loginTime')"
        align="center"
        prop="loginTime"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  list,
  delLogininfor,
  cleanLogininfor,
  unlockLogininfor,
} from "@/api/monitor/logininfor";

export default {
  name: "Logininfor",
  dicts: ["sys_common_status"],
  data() {
    return {
      // Loading
      loading: true,
      // Selected IDs
      ids: [],
      // Single disabled
      single: true,
      // Multiple disabled
      multiple: true,
      // 选择用户名
      selectName: "",
      // Show search
      showSearch: true,
      // Total count
      total: 0,
      // Table data
      list: [],
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: { prop: "loginTime", order: "descending" },
      // Query params
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ipaddr: undefined,
        userName: undefined,
        status: undefined,
      },
    };
  },
  created() {
    //获取天日期yyyy-MM-dd  00:00:00
    this.dateRange[0] = this.getNowFormatDate() + " 00:00:00";
    //获取天日期yyyy-MM-dd  23:59:59
    this.dateRange[1] = this.getNowFormatDate() + " 23:59:59";
    this.getList();
  },
  methods: {
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    /** Query login log list */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** Search handler */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** Reset handler */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.pageNum = 1;
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order);
    },
    /** Selection change handler */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.infoId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.selectName = selection.map((item) => item.userName);
    },
    /** Sort change handler */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** Delete handler */
    handleDelete(row) {
      const infoIds = row.infoId || this.ids;
      this.$modal
        .confirm(this.$t("logininfor.confirmRemove", { infoIds: infoIds }))
        .then(function () {
          return delLogininfor(infoIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commonTips.remove_s"));
        })
        .catch(() => {});
    },
    /** Clear handler */
    handleClean() {
      this.$modal
        .confirm(this.$t("logininfor.conformRemoveLog"))
        .then(function () {
          return cleanLogininfor();
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commonTips.clear_s"));
        })
        .catch(() => {});
    },
    /** Unlock handler */
    handleUnlock() {
      const username = this.selectName;
      this.$modal
        .confirm(
          this.$t("logininfor.confirmUnloackUser", { username: username })
        )
        .then(function () {
          return unlockLogininfor(username);
        })
        .then(() => {
          this.$modal.msgSuccess(
            this.$t("commonTips.unlockSuccessfully", { username: username })
          );
        })
        .catch(() => {});
    },
    /** Export handler */
    handleExport() {
      this.download(
        "monitor/logininfor/export",
        {
          ...this.queryParams,
        },
        `logininfor_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

