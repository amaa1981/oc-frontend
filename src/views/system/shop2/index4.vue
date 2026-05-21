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
      <el-form-item :label="$t('shop.recordQuery.timeRange')" prop="dateRange">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          :range-separator="$t('shop.recordQuery.to')"
          :start-placeholder="$t('shop.recordQuery.startDate')"
          :end-placeholder="$t('shop.recordQuery.endDate')"
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
          >{{ $t("shop.recordQuery.query") }}</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
          $t("shop.recordQuery.reset")
        }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="recordList">
      <el-table-column
        :label="$t('shop.recordQuery.serialNumber')"
        align="center"
        type="index"
        width="50"
      />
      <el-table-column
        :label="$t('shop.recordQuery.time')"
        align="center"
        prop="sendTime"
      />
      <el-table-column
        :label="$t('shop.recordQuery.customerId')"
        align="center"
      >
        <template slot-scope="scope">
          {{ getGuestId(scope.row.strRes) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('shop.recordQuery.deviceIp')" align="center">
        <template slot-scope="scope">
          {{ getCameraIp(scope.row.strRes) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('shop.recordQuery.regionId')" align="center">
        <template slot-scope="scope">
          {{ getRegionId(scope.row.strRes) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('shop.recordQuery.stayStartTime')"
        align="center"
      >
        <template slot-scope="scope">
          {{ getBegTime(scope.row.strRes) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('shop.recordQuery.stayEndTime')"
        align="center"
      >
        <template slot-scope="scope">
          {{ getEndTime(scope.row.strRes) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('shop.recordQuery.image')" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.imageUrl"
            :src="scope.row.imageUrl"
            :preview-src-list="[scope.row.imageUrl]"
            style="width: 50px; height: 50px"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <span v-else>{{ $t("shop.recordQuery.noImage") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('shop.recordQuery.operation')"
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
  name: "RecordQueryType10",
  data() {
    return {
      // Loading
      loading: true,
      // Show search
      showSearch: true,
      // Total count
      total: 0,
      // 记录列表
      recordList: [],
      // Date range
      dateRange: [],
      // Query params
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        recordUrl1: 10,
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
          console.error("Failed to get record list", error);
          this.loading = false;
        });
    },
    /** Get guestId from strRes string */
    getGuestId(strRes) {
      if (!strRes) {
        return "";
      }
      try {
        const resObj = JSON.parse(strRes);
        if (resObj.retention && Array.isArray(resObj.retention)) {
          // 提取所有guestId并用逗号连接
          const guestIds = resObj.retention
            .map((item) => item.guestId)
            .filter((id) => id) // Filter empty values
            .join(", ");
          return guestIds || "";
        }
        return "";
      } catch (error) {
        console.error("Failed to parse strRes", error);
        return "";
      }
    },
    /** Get regionId from strRes string */
    getRegionId(strRes) {
      if (!strRes) {
        return "";
      }
      try {
        const resObj = JSON.parse(strRes);
        if (resObj.retention && Array.isArray(resObj.retention)) {
          // 提取所有regionId并用逗号连接
          const regionIds = resObj.retention
            .map((item) => item.regionId)
            .filter((id) => id) // Filter empty values
            .join(", ");
          return regionIds || "";
        }
        return "";
      } catch (error) {
        console.error("Failed to parse strRes", error);
        return "";
      }
    },
    /** Get cameraIp from strRes string */
    getCameraIp(strRes) {
      if (!strRes) {
        return "";
      }
      try {
        const resObj = JSON.parse(strRes);
        if (resObj.retention && Array.isArray(resObj.retention)) {
          // 提取所有cameraIp并用逗号连接
          const cameraIps = resObj.retention
            .map((item) => item.cameraIp)
            .filter((ip) => ip) // Filter empty values
            .join(", ");
          return cameraIps || "";
        }
        return "";
      } catch (error) {
        console.error("Failed to parse strRes", error);
        return "";
      }
    },
    /** Get stay start time from strRes */
    getBegTime(strRes) {
      if (!strRes) {
        return "";
      }
      try {
        const resObj = JSON.parse(strRes);
        if (resObj.retention && Array.isArray(resObj.retention)) {
          // 提取所有begTime并用逗号连接
          const begTimes = resObj.retention
            .map((item) => item.begTime)
            .filter((time) => time) // Filter empty values
            .join(", ");
          return begTimes || "";
        }
        return "";
      } catch (error) {
        console.error("Failed to parse strRes for begTime", error);
        return "";
      }
    },
    /** Get stay end time from strRes */
    getEndTime(strRes) {
      if (!strRes) {
        return "";
      }
      try {
        const resObj = JSON.parse(strRes);
        if (resObj.retention && Array.isArray(resObj.retention)) {
          // 提取所有endTime并用逗号连接
          const endTimes = resObj.retention
            .map((item) => item.endTime)
            .filter((time) => time) // Filter empty values
            .join(", ");
          return endTimes || "";
        }
        return "";
      } catch (error) {
        console.error("Failed to parse strRes for endTime", error);
        return "";
      }
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
      this.queryParams.recordUrl1 = 10;
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
</style>
