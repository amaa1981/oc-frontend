<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item :label="$t('record.eventTypeId')" prop="eventTypeId">
        <el-select
          v-model="queryParams.eventTypeId"
          :placeholder="$t('commonTips.pleaseSelect')"
          filterable
        >
          <el-option
            v-for="(dict, index) in dict.type.v1_alarm_type"
            :key="index"
            :label="$t('dict.v1_alarm_type.' + dict.value)"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>


      <el-form-item :label="$t('record.sendTime')" prop="sendTime">
        <el-date-picker
          v-model="queryParams.sendTime"
          type="datetimerange"
          range-separator="-"
          start-placeholder=""
          end-placeholder=""
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('record.equipmentName')" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('record.taskName')" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="处理状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择处理状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.v1_set_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
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
      <el-form-item class="form-actions-right">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:record:remove']"
          >{{ $t("commonBtn.remove") }}</el-button
        >
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >{{ $t("commonBtn.export") }}</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="recordList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        :label="$t('record.imageUrl')"
        align="center"
        prop="imageUrl"
        width="200"
      >
        <template slot-scope="scope">
          <video
            controls
            autoplay
            loop
            :width="200"
            :height="150"
            :src="scope.row.videoUrl"
            v-if="scope.row.videoUrl"
          ></video>

          <image-preview
            :src="scope.row.imageUrl"
            :width="50"
            :height="50"
            v-else
          />
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('record.eventTypeId')"
        align="center"
        prop="eventTypeId"
      >
        <template slot-scope="scope">
          <!-- <dict-tag
            :options="dict.type.v1_alarm_type"
            :value="scope.row.eventTypeId"
          /> -->
          {{ $t("dict.v1_alarm_type." + scope.row.eventTypeId) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('record.sendTime')"
        align="center"
        prop="sendTime"
      />
      <el-table-column
        :label="$t('record.equipmentName')"
        align="center"
        prop="equipmentName"
      />
      <el-table-column
        :label="$t('record.installationArea')"
        align="center"
        prop="installationArea"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.v1_device_area"
            :value="scope.row.installationArea"
            v-if="scope.row.installationArea"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('record.taskName')"
        align="center"
        prop="taskName"
      />
      <el-table-column
        :label="$t('record.handleStatus')"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="warning">
            {{ $t("dict.v1_set_status." + scope.row.status) }}
          </el-tag>
          <el-tag v-if="scope.row.status == 1" type="success">
            {{ $t("dict.v1_set_status." + scope.row.status) }}
          </el-tag>
          <el-tag v-if="scope.row.status == 2" type="danger">
            {{ $t("dict.v1_set_status." + scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('record.handleTime')"
        align="center"
        prop="operateTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.operateTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('record.remarks')"
        align="center"
        prop="remarks"
      />
      <!-- <el-table-column label="处理人" align="center" prop="operateBy" /> -->
      <el-table-column
        :label="$t('record.operate')"
        align="center"
        class-name="small-padding fixed-width"
        width="250px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            class="btn-view"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:record:edit']"
            >{{ $t("record.check") }}</el-button
          >
          <span class="action-divider" />
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="btn-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:record:remove']"
            >{{ $t("commonBtn.remove") }}</el-button
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

    <!-- 告警详情组件 -->
    <alarm-detail
      :visible.sync="open"
      :alarm-data="form"
      @refresh="getList"
      @close="cancel"
    />
  </div>
</template>

<script>
import {
  listRecord,
  getRecord,
  delRecord,
  addRecord,
  updateRecord,
} from "@/api/system/record";
import AlarmDetail from "@/components/AlarmDetail";

export default {
  name: "Record",
  dicts: ["v1_set_status", "v1_alarm_type", "v1_device_area"],
  components: {
    AlarmDetail,
  },
  data() {
    return {
      IP: "http://" + window.location.hostname,
      strRes: {},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 告警记录信息表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eventTypeId: null,
        equipmentId: null,
        equipmentName: null,
        status: null,
        sendTime: null,
        startTime: null,
        endTime: null,
        installationArea: localStorage.getItem('installationArea') || null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      opens: false,
      strRes: {},
      // 是否显示弹出层
      openss: false,
      // 表单参数
      formss: {},
      // 表单校验
      rulesss: {},
    };
  },
  computed: {
    // 日期选择器快捷选项
    pickerOptions() {
      return {
        shortcuts: [
          {
            text: this.$t("record.today") || "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("record.last7Days") || "最近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("record.last30Days") || "最近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit("pick", [start, end]);
            },
          },
       
        ],
        // 禁止选择明天之后的时间
        disabledDate(time) {
          // 获取明天的开始时间（00:00:00）
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          // 禁止选择明天及之后的日期
          return time.getTime() >= tomorrow.getTime();
        },
      };
    },
  },
  created() {
    // 先处理URL参数
    this.handleUrlParams();
    // 如果没有时间参数传入，才设置默认当天
    if (!this.queryParams.sendTime) {
      this.queryParams.sendTime = [
        this.getNowFormatDate() + " 00:00:00",
        this.getNowFormatDate() + " 23:59:59",
      ];
    }
    this.getList();
    // 监听设备区域变化
    this.$bus.$on('installationAreaChange', this.onInstallationAreaChange);
  },
  beforeDestroy() {
    // 移除监听
    this.$bus.$off('installationAreaChange', this.onInstallationAreaChange);
  },
  methods: {
    // 设备区域变化处理
    onInstallationAreaChange(val) {
      this.queryParams.installationArea = val || null;
      this.handleQuery();
    },
    // 处理URL参数
    handleUrlParams() {
      const { eventTypeId, startTime, endTime, equipmentName } =
        this.$route.query;
      if (eventTypeId) {
        this.queryParams.eventTypeId = eventTypeId;
      }
      // 处理设备名称参数
      if (equipmentName) {
        this.queryParams.equipmentName = equipmentName;
      }
      // 处理时间参数
      if (startTime && endTime) {
        this.queryParams.sendTime = [startTime, endTime];
        this.queryParams.startTime = startTime;
        this.queryParams.endTime = endTime;
      }
    },
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
    /** 查询告警记录信息列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);
      if (
        this.queryParams.sendTime != null &&
        this.queryParams.sendTime.length > 0
      ) {
        this.queryParams.startTime = this.queryParams.sendTime[0];
        this.queryParams.endTime = this.queryParams.sendTime[1];
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
      listRecord(this.queryParams).then((response) => {
        this.recordList = response.data.records;
        this.total = response.data.totalCount;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        recordUrl1: null,
        recordUrl2: null,
        imageUrl: null,
        videoUrl: null,
        eventTypeId: null,
        sendTime: null,
        equipmentId: null,
        equipmentName: null,
        taskId: null,
        taskName: null,
        strRes: null,
        isWriteWaringUser: null,
        pushStatus: "0",
        status: null,
        remarks: null,
        operateTime: null,
        operateBy: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t("record.dialogTitle_a");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t("record.dialogTitle");
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm(this.$t("record.confirmRemove", { ids: ids }))
        .then(function () {
          return delRecord(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commonTips.remove_s"));
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "api/alarm/record/export",
        {
          ...this.queryParams,
        },
        `record_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
