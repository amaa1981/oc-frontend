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

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList">
      <el-table-column
        :label="$t('shop.recordQuery.serialNumber')"
        align="center"
        type="index"
        width="80"
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
      // Loading state
      loading: true,
      // Show search conditions
      showSearch: true,
      // Total count
      total: 0,
      // Record List
      recordList: [],
      // date range
      dateRange: [],
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        recordUrl1: 10,
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
          console.error("Failed to get record list", error);
          this.loading = false;
        });
    },
    /** Get guestId from strRes */
    getGuestId(strRes) {
      if (!strRes) {
        return "";
      }
      try {
        const resObj = JSON.parse(strRes);
        if (resObj.retention && Array.isArray(resObj.retention)) {
          // Extract all guestIds and concatenate with comma
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
    /** Get regionId from strRes */
    getRegionId(strRes) {
      if (!strRes) {
        return "";
      }
      try {
        const resObj = JSON.parse(strRes);
        if (resObj.retention && Array.isArray(resObj.retention)) {
          // Extract all regionIds and concatenate with comma
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
    /** Get cameraIp from strRes */
    getCameraIp(strRes) {
      if (!strRes) {
        return "";
      }
      try {
        const resObj = JSON.parse(strRes);
        if (resObj.retention && Array.isArray(resObj.retention)) {
          // Extract all cameraIps and concatenate with comma
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
          // Extract all begTime and concatenate with comma
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
          // Extract all endTime and concatenate with comma
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
      // Keep fixed parameters unchanged
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
