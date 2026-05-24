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

    <el-table v-loading="loading" :data="recordList">
      <el-table-column
        :label="$t('shopStatistics.serialNumber')"
        align="center"
        type="index"
        width="50"
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
            class="btn-delete"
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
      // Loading
      loading: true,
      // Show search
      showSearch: true,
      // Total count
      total: 0,
      // Record List
      recordList: [],
      // Date range
      dateRange: [],
      // Query params
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        recordUrl1: 20,
        eventTypeId: "45BB561E-EA54-4F13-A7E6-A11DE5C75648",
        installationArea: localStorage.getItem('installationArea') || null,
      },
      // Date picker configuration
      pickerOptions: {
        disabledDate(time) {
          // Disable tomorrow and later dates
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return time.getTime() > today.getTime();
        },
      },
    };
  },
  created() {
    this.getList();
    // Monitor device area changes
    this.$bus.$on('installationAreaChange', this.onInstallationAreaChange);
  },
  beforeDestroy() {
    // Remove listening
    this.$bus.$off('installationAreaChange', this.onInstallationAreaChange);
  },
  methods: {
    // Device area change processing
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
          console.error("Failed to fetch record list", error);
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
      // Keep fixed parameters unchanged
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
    /** Get specified field from conversation array in strRes */
    getConversationValue(strRes, fieldName) {
      try {
        if (!strRes) return "-";

        // If strRes is a string, it needs to be parsed as JSON
        const data = typeof strRes === "string" ? JSON.parse(strRes) : strRes;

        // Check if there is a conversation array and it is not empty
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
        console.error("Failed to parse strRes data:", error);
        return "-";
      }
    },
    /** Calculate interaction duration (end - start time) */
    calculateDuration(strRes) {
      try {
        if (!strRes) return "-";

        // If strRes is a string, it needs to be parsed as JSON
        const data = typeof strRes === "string" ? JSON.parse(strRes) : strRes;

        // Check if there is a conversation array and it is not empty
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

          // parsing time
          const startTime = new Date(begTime);
          const finishTime = new Date(endTime);

          // Calculation time difference (milliseconds)
          const diffMs = finishTime.getTime() - startTime.getTime();

          if (diffMs < 0) return "-";

          // Convert to seconds
          const diffSeconds = Math.floor(diffMs / 1000);

          // Formatted as hours, minutes and seconds
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
        console.error("Failed to calculate interaction duration:", error);
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
