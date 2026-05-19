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
      <el-form-item :label="$t('operlog.title')" prop="title">
        <el-input
          v-model="queryParams.title"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('operlog.operName')" prop="operName">
        <el-input
          v-model="queryParams.operName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('operlog.businessType')" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_oper_type"
            :key="dict.value"
            :label="$t('dict.sys_oper_type.' + dict.value)"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('operlog.status')" prop="status">
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
      <el-form-item :label="$t('operlog.dateRange')">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('operlog.startTime_p')"
          :end-placeholder="$t('operlog.endTime_p')"
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
          v-hasPermi="['monitor:operlog:remove']"
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
          v-hasPermi="['monitor:operlog:remove']"
          >{{ $t("commonBtn.clear") }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:operlog:export']"
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
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        :label="$t('operlog.operId')"
        align="center"
        prop="operId"
      />
      <el-table-column
        :label="$t('operlog.title')"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('operlog.businessType')"
        align="center"
        prop="businessType"
      >
        <template slot-scope="scope">
          <!-- <dict-tag
            :options="dict.type.sys_oper_type"
            :value="scope.row.businessType"
          /> -->

          {{ $t("dict.sys_oper_type." + scope.row.businessType) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('operlog.operName')"
        align="center"
        prop="operName"
        width="110"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        :label="$t('operlog.operIp')"
        align="center"
        prop="operIp"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('operlog.operLocation')"
        align="center"
        prop="operLocation"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('operlog.status')"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          {{ $t("dict.sys_common_status." + scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('operlog.operTime')"
        align="center"
        prop="operTime"
        width="160"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('operlog.costTime')"
        align="center"
        prop="costTime"
        width="110"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.costTime }}{{ $t("operlog.ms") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('operlog.operate')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row, scope.index)"
            v-hasPermi="['monitor:operlog:query']"
            >{{ $t("operlog.detail") }}</el-button
          >
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

    <!-- 操作日志详细 -->
    <el-dialog
      :title="$t('operlog.dialogTitle')"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('operlog.operModule')"
              >{{ form.title }} / {{ typeFormat(form) }}</el-form-item
            >
            <el-form-item :label="$t('operlog.loginInfo')"
              >{{ form.operName }} / {{ form.operIp }} /
              {{ form.operLocation }}</el-form-item
            >
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('operlog.operUrl')">{{
              form.operUrl
            }}</el-form-item>
            <el-form-item :label="$t('operlog.requestMethod')">{{
              form.requestMethod
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('operlog.method')">{{
              form.method
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('operlog.operParam')">{{
              form.operParam
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('operlog.jsonResult')">{{
              form.jsonResult
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('operlog.status')">
              <div v-if="form.status === 0">{{ $t("operlog.normal") }}</div>
              <div v-else-if="form.status === 1">{{ $t("operlog.fail") }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('operlog.costTime')"
              >{{ form.costTime }}{{ $t("operlog.ms") }}</el-form-item
            >
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('operlog.operTime')">{{
              parseTime(form.operTime)
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('operlog.errorMsg')"
              v-if="form.status === 1"
              >{{ form.errorMsg }}</el-form-item
            >
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">{{ $t("commonBtn.close") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, delOperlog, cleanOperlog } from "@/api/monitor/operlog";

export default {
  name: "Operlog",
  dicts: ["sys_oper_type", "sys_common_status"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: { prop: "operTime", order: "descending" },
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
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
    /** 查询登录日志 */
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
    // 操作日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(
        this.dict.type.sys_oper_type,
        row.businessType
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.pageNum = 1;
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order);
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.operId);
      this.multiple = !selection.length;
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids;
      this.$modal
        .confirm(this.$t("operlog.confirmRemoveLog", { operIds: operIds }))
        .then(function () {
          return delOperlog(operIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("operlog.remove_s"));
        })
        .catch(() => {});
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$modal
        .confirm(this.$t("operlog.confirmRemoveAllLog"))
        .then(function () {
          return cleanOperlog();
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("operlog.clear_s"));
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "monitor/operlog/export",
        {
          ...this.queryParams,
        },
        `operlog_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

