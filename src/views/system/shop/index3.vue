<!--
 * @Author: FGJ
 * @Date: 2025-09-10 17:12:19
 * @Descripttion: 
 * @LastEditTime: 2025-09-12 14:04:50
 * @LastEditors: FGJ
 * @version: 
-->

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
      <el-form-item :label="$t('shopStatistics.timeRange')" prop="dateRange">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="to"
          :start-placeholder="$t('shopStatistics.startDate')"
          :end-placeholder="$t('shopStatistics.endDate')"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          @change="handleDateRangeChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >{{ $t("shopStatistics.query") }}</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
          $t("shopStatistics.reset")
        }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList">
      <el-table-column
        :label="$t('shopStatistics.serialNumber')"
        align="center"
        type="index"
        width="80"
      />
      <el-table-column
        :label="$t('customerStatistics.startTime')"
        align="center"
      >
        <template slot-scope="scope">
          {{ getConversationValue(scope.row.strRes, "begTime") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customerStatistics.endTime')" align="center">
        <template slot-scope="scope">
          {{ getConversationValue(scope.row.strRes, "endTime") }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('customerStatistics.customerId')"
        align="center"
      >
        <template slot-scope="scope">
          {{ getConversationValue(scope.row.strRes, "guestId") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('trajectoryQuery.areaId')" align="center">
        <template slot-scope="scope">
          {{ getConversationValue(scope.row.strRes, "regionId") }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('customerStatistics.conversationDuration')"
        align="center"
      >
        <template slot-scope="scope">
          {{ calculateDuration(scope.row.strRes) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('trajectoryQuery.deviceIp')" align="center">
        <template slot-scope="scope">
          {{ getConversationValue(scope.row.strRes, "cameraIp") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('trajectoryQuery.image')" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.imageUrl"
            :preview-src-list="[scope.row.imageUrl]"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('shopStatistics.operation')"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >{{ $t('commonBtn.remove') }}</el-button
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
  </div>
</template>

<script>
import { getRecordList } from "@/api/alarm/record";
import { delRecord } from "@/api/system/record";

export default {
  name: "RecordQuery",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 记录列表
      recordList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        recordUrl1: 20,
        eventTypeId: "45BB561E-EA54-4F13-A7E6-A11DE5C75648",
        installationArea: localStorage.getItem('installationArea') || null,
      },
      // 日期选择器配置
      pickerOptions: {
        disabledDate(time) {
          // 禁用明天及之后的日期
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return time.getTime() > today.getTime();
        },
      },
    };
  },
  created() {
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
    /** Query record list */
    getList() {
      this.loading = true;
      getRecordList(this.queryParams)
        .then((response) => {
          this.recordList = response.data.records || [];
          this.total = response.data.totalCount || 0;
          this.loading = false;
        })
        .catch((error) => {
          console.error("获取记录列表失败", error);
          this.loading = false;
        });
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
      // 保持固定参数不变
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
      this.queryParams.recordUrl1 = 20;
      this.queryParams.eventTypeId = "45BB561E-EA54-4F13-A7E6-A11DE5C75648";
      this.handleQuery();
    },
    /** Date range change handler */
    handleDateRangeChange(val) {
      if (val) {
        this.queryParams.startTime = val[0];
        this.queryParams.endTime = val[1];
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    },
    /** Get field from conversation array in strRes */
    getConversationValue(strRes, fieldName) {
      try {
        if (!strRes) return "-";

        // 如果strRes是字符串，需要解析为JSON
        const data = typeof strRes === "string" ? JSON.parse(strRes) : strRes;

        // 检查是否有conversation数组且不为空
        if (
          data &&
          data.conversation &&
          Array.isArray(data.conversation) &&
          data.conversation.length > 0
        ) {
          const firstConversation = data.conversation[0];
          return firstConversation[fieldName] || "-";
        }

        return "-";
      } catch (error) {
        console.error("解析strRes数据失败:", error);
        return "-";
      }
    },
    /** Calculate interaction duration */
    calculateDuration(strRes) {
      try {
        if (!strRes) return "-";

        // 如果strRes是字符串，需要解析为JSON
        const data = typeof strRes === "string" ? JSON.parse(strRes) : strRes;

        // 检查是否有conversation数组且不为空
        if (
          data &&
          data.conversation &&
          Array.isArray(data.conversation) &&
          data.conversation.length > 0
        ) {
          const firstConversation = data.conversation[0];
          const begTime = firstConversation.begTime;
          const endTime = firstConversation.endTime;

          if (!begTime || !endTime) return "-";

          // 解析时间
          const startTime = new Date(begTime);
          const finishTime = new Date(endTime);

          // 计算时间差（毫秒）
          const diffMs = finishTime.getTime() - startTime.getTime();

          if (diffMs < 0) return "-";

          // 转换为秒
          const diffSeconds = Math.floor(diffMs / 1000);

          // 格式化为时分秒
          const hours = Math.floor(diffSeconds / 3600);
          const minutes = Math.floor((diffSeconds % 3600) / 60);
          const seconds = diffSeconds % 60;

          if (hours > 0) {
            return `${hours}${this.$t(
              "customerStatistics.hours"
            )}${minutes}${this.$t(
              "customerStatistics.minutes"
            )}${seconds}${this.$t("customerStatistics.seconds")}`;
          } else if (minutes > 0) {
            return `${minutes}${this.$t(
              "customerStatistics.minutes"
            )}${seconds}${this.$t("customerStatistics.seconds")}`;
          } else {
            return `${seconds}${this.$t("customerStatistics.seconds")}`;
          }
        }

        return "-";
      } catch (error) {
        console.error("计算交流时长失败:", error);
        return "-";
      }
    },
    /** Delete handler */
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
  },
};
</script>

<style scoped>
.el-table .cell {
  padding: 8px 12px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}
</style>
