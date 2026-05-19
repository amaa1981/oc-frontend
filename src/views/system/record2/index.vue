<!-- 加油站项目用 -->
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
      <el-form-item :label="$t('record.sendTime')" prop="sendTime">
        <el-date-picker
          v-model="queryParams.sendTime"
          type="datetimerange"
          range-separator="-"
          start-placeholder=""
          end-placeholder=""
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
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
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:record:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:record:edit']"
          >修改</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
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
      </el-col> -->
    </el-row>
    <!-- 记录列表显示区域 -->
    <div class="record-list-container" v-loading="loading">
      <div class="record-grid">
        <div v-for="item in recordList" :key="item.id" class="record-item-card">
          <div class="record-header">
            <div class="record-title">
              <i
                class="el-icon-warning"
                style="color: #f56c6c; margin-right: 8px"
              ></i>
              {{ item.equipmentName || "设备名称" }}
            </div>
            <div class="record-time">
              事件时间 {{ item.strRes.startTime }} ~ {{ item.strRes.endTime }}
            </div>
          </div>

          <div class="record-content">
            <div class="record-info">
              <div class="info-item">
                <label>告警类型:</label>
                <span>卸油记录</span>
              </div>
              <div class="info-item" v-if="item.strRes">
                <label>检测结果:</label>
                <div class="detection-results">
                  <!-- 如果是字符串类型 -->
                  <ul
                    v-if="typeof item.strRes === 'string'"
                    class="result-list"
                  >
                    <li>{{ item.strRes }}</li>
                  </ul>
                  <!-- 如果是对象类型 -->
                  <ul v-else class="result-list">
                    <li
                      v-if="
                        item.strRes.gasStationResponse &&
                        Array.isArray(item.strRes.gasStationResponse) &&
                        item.strRes.gasStationResponse.length > 0
                      "
                    >
                      <div class="gas-station-table">
                        <el-table
                          :data="item.strRes.gasStationResponse"
                          border
                          size="mini"
                          :row-style="{ height: '50px' }"
                          :cell-style="{ padding: '0px' }"
                        >
                          <el-table-column
                            prop="eventTypeId"
                            label="事件类型"
                            min-width="200"
                            align="center"
                          >
                            <template slot-scope="scope">
                              <div
                                v-if="
                                  scope.row.eventTypeId ==
                                  '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d-1'
                                "
                              >
                                人员是否未佩戴安全帽
                              </div>
                              <div
                                v-if="
                                  scope.row.eventTypeId ==
                                  '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d-3'
                                "
                              >
                                人员是否有防静电措施
                              </div>
                              <div
                                v-if="
                                  scope.row.eventTypeId ==
                                  '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d-4'
                                "
                              >
                                场地是否摆放灭火器
                              </div>
                              <div
                                v-if="
                                  scope.row.eventTypeId ==
                                  '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d-5'
                                "
                              >
                                油罐车是否防静电措施
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="hasAlarm"
                            label="完成状态"
                            min-width="100"
                            align="center"
                          >
                            <template slot-scope="scope">
                              <el-tag
                                :type="
                                  scope.row.hasAlarm == 0 &&
                                  scope.row.eventTypeId !=
                                    '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d-1'
                                    ? 'danger'
                                    : 'success'
                                "
                                size="mini"
                              >
                                <span
                                  v-if="
                                    scope.row.eventTypeId ==
                                    '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d-1'
                                  "
                                >
                                  {{
                                    scope.row.hasAlarm
                                      ? "无佩戴安全帽"
                                      : "有佩戴安全帽"
                                  }}
                                </span>
                                <span v-else>
                                  {{ scope.row.hasAlarm ? "是" : "否" }}</span
                                >
                              </el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="sendTime"
                            label="发生时间"
                            min-width="140"
                            align="center"
                          >
                            <template slot-scope="scope">
                              {{ scope.row.sendTime || "-" }}
                            </template>
                          </el-table-column>

                          <el-table-column
                            prop="imageUrl"
                            label="事件图片"
                            min-width="80"
                            align="center"
                          >
                            <template slot-scope="scope">
                              <span v-if="!scope.row.imageUrl" class="no-image"
                                >无</span
                              >
                              <el-image
                                v-else
                                :src="scope.row.imageUrl"
                                :preview-src-list="[scope.row.imageUrl]"
                                style="width: 40px; height: 30px"
                                fit="cover"
                              >
                                <div slot="error" class="image-slot">
                                  <span class="no-image">无</span>
                                </div>
                              </el-image>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- <div class="info-item">
                <label>开始时间:</label>
                <span>{{ item.strRes.startTime }}</span>
              </div>
              <div class="info-item">
                <label>结束时间:</label>
                <span>{{ item.strRes.endTime }}</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <div v-if="recordList.length === 0 && !loading" class="empty-container">
        <el-empty description="暂无记录数据"></el-empty>
      </div>
    </div>

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
  listRecord,
  getRecord,
  delRecord,
  addRecord,
  updateRecord,
} from "@/api/system/record";

export default {
  name: "Record2",
  dicts: ["v1_set_status", "v1_alarm_type"],
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
        eventTypeId: "1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24E",
        sendTime: [],
        equipmentName: null,
        taskName: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // remarks: [{ required: true, message: "请输入", trigger: "change" }],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    // 处理URL参数
    this.handleUrlParams();
    // //获取天日期yyyy-MM-dd  00:00:00
    // this.queryParams.sendTime[0] = this.getNowFormatDate() + " 00:00:00";
    // //获取天日期yyyy-MM-dd  23:59:59
    // this.queryParams.sendTime[1] = this.getNowFormatDate() + " 23:59:59";
    console.log(this.queryParams.sendTime);
    this.getList();
  },
  methods: {
    // 处理URL参数
    handleUrlParams() {
      const { eventTypeId } = this.$route.query;
      if (eventTypeId) {
        this.queryParams.eventTypeId = eventTypeId;
      }
    },
    async removeAlarm(data) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.status = 2;
          this.form.operateTime = new Date().getTime();
          updateRecord(this.form).then((response) => {
            this.$modal.msgSuccess(this.$t("commonTips.operate_s"));
            this.open = false;
            this.getList();
          });
        }
      });
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
        this.recordList.forEach((item) => {
          item.strRes = JSON.parse(item.strRes);
        });
        console.log(this.recordList);
        this.total = response.data.totalCount;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            if (this.form.remarks == null || this.form.remarks == "") {
              this.$modal.msgError(
                this.$t("commonTips.pleaseSelect") + this.$t("record.remarks")
              );
              return;
            }
            this.form.status = 1;
            this.form.operateTime = new Date().getTime();
            updateRecord(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addRecord(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.add_s"));
              this.open = false;
              this.getList();
            });
          }
        }
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
    /** 获取告警类型名称 */
    getAlarmTypeName(eventTypeId) {
      const alarmTypes = this.dict.type.v1_alarm_type || [];
      const type = alarmTypes.find((item) => item.value === eventTypeId);
      return type ? this.$t("dict.v1_alarm_type." + type.value) : "未知类型";
    },
  },
};
</script>

<style scoped>
.record-list-container {
  margin-top: 20px;
}

/* 网格布局容器 */
.record-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.record-item-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: fit-content;
}

.record-item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #409eff;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.record-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
}

.record-time {
  font-size: 12px;
  color: #909399;
}

.record-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.record-info {
  flex: 1;
  margin-right: 16px;
}

.info-item {
  display: flex;
  margin-bottom: 6px;
  line-height: 1.4;
  font-size: 13px;
}

.info-item label {
  font-weight: 500;
  color: #606266;
  width: 70px;
  flex-shrink: 0;
  font-size: 12px;
}

.info-item span {
  color: #303133;
  flex: 1;
  word-break: break-all;
  font-size: 12px;
}

.record-media {
  flex-shrink: 0;
}

.media-preview {
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.record-status {
  flex: 1;
}

.record-actions {
  flex-shrink: 0;
}

.empty-container {
  text-align: center;
  padding: 40px 0;
}

/* 检测结果列表样式 */
.detection-results {
  margin-top: 8px;
  width: 100%;
}

.result-list {
  margin: 0;
  padding: 0;
  list-style: none;
  background: #f8f9fa;
  border-radius: 4px;
  padding: 12px 16px;
  border-left: 3px solid #409eff;
}

.result-list li {
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: #606266;
}

.result-list li:last-child {
  margin-bottom: 0;
}

.result-list li strong {
  color: #303133;
  margin-right: 4px;
}

/* gasStationResponse 表格样式 */
.gas-station-table {
  margin-top: 8px;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.gas-station-table .el-table {
  border-radius: 4px;
  font-size: 12px;
}

.gas-station-table .el-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
  padding: 8px 5px;
}

.gas-station-table .el-table td {
  padding: 8px 5px;
}

.no-image {
  color: #909399;
  font-size: 12px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .record-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .record-grid {
    grid-template-columns: 1fr;
  }

  .record-content {
    flex-direction: column;
  }

  .record-info {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .record-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .record-time {
    margin-top: 8px;
  }
}
</style>
