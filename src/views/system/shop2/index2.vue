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
          range-separator="-"
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

    <el-table v-loading="loading" :data="trajectoryList">
      <el-table-column
        :label="$t('shopStatistics.serialNumber')"
        align="center"
        type="index"
        width="50"
      />
      <el-table-column
        :label="$t('trajectoryQuery.guestId')"
        align="center"
        prop="recordUrl1"
      />
      <el-table-column
        :label="$t('trajectoryQuery.trajectoryTime')"
        align="center"
        prop="taskName"
      />
      <el-table-column
        :label="$t('trajectoryQuery.areaId')"
        align="center"
        prop="recordUrl2"
      />
      <el-table-column
        :label="$t('trajectoryQuery.equipmentName')"
        align="center"
        prop="equipmentName"
      />
      <el-table-column
        :label="$t('device.installationArea')"
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
      <!-- <el-table-column
        :label="$t('shopStatistics.type')"
        align="center"
        prop="remarks"
      >
        <template slot-scope="scope">
          {{
            scope.row.remarks ? $t("shopStatistics." + scope.row.remarks) : ""
          }}
        </template>
      </el-table-column> -->

      <el-table-column
        :label="$t('trajectoryQuery.deviceIp')"
        align="center"
        prop="equipmentId"
      />
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
        :label="$t('trajectoryQuery.eventTime')"
        align="center"
        prop="taskId"
      />

      <el-table-column
        :label="$t('trajectoryQuery.operation')"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-view"
            class="btn-view"
            @click="handleDetail(scope.row)"
            >{{ $t("trajectoryQuery.detail") }}</el-button
          >
          <span class="action-divider" />
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            class="btn-delete"
            @click="handleDelete(scope.row)"
            >{{ $t("trajectoryQuery.delete") }}</el-button
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

    <!-- Details pop-up window -->
    <el-dialog
      :title="$t('trajectoryQuery.trajectoryDetail')"
      :visible.sync="detailVisible"
      width="80%"
      append-to-body
    >
      <el-table v-loading="detailLoading" :data="trajectoryDetailList">
        <el-table-column
          :label="$t('shopStatistics.serialNumber')"
          align="center"
          type="index"
          width="50"
        />
        <el-table-column
          :label="$t('trajectoryQuery.deviceIp')"
          align="center"
          prop="equipmentId"
        />
        <el-table-column
          :label="$t('trajectoryQuery.guestId')"
          align="center"
          prop="recordUrl1"
        />
        <el-table-column
          :label="$t('trajectoryQuery.trajectoryTime')"
          align="center"
          prop="taskName"
        />
        <el-table-column
          :label="$t('trajectoryQuery.areaId')"
          align="center"
          prop="recordUrl2"
        />
        <el-table-column
          :label="$t('shopStatistics.type')"
          align="center"
          prop="remarks"
        >
          <template slot-scope="scope">
            {{
              scope.row.remarks ? $t("shopStatistics." + scope.row.remarks) : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('trajectoryQuery.eventTime')"
          align="center"
          prop="taskId"
        />
        <el-table-column :label="$t('trajectoryQuery.image')" align="center">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.imageUrl"
              style="width: 60px; height: 60px"
              :src="scope.row.imageUrl"
              :preview-src-list="detailImageList"
              :initial-index="getImageIndex(scope.row.imageUrl)"
              fit="cover"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <span v-else>{{ $t("trajectoryQuery.noImage") }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">{{
          $t("trajectoryQuery.close")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { trajectoryPage, getTrajectory, delTrajectory } from "@/api/alarm/record";

export default {
  name: "TrajectoryQuery",
  dicts: ["v1_device_area"],
  data() {
    return {
      // Loading
      loading: true,
      // Show search
      showSearch: true,
      // Total count
      total: 0,
      // Track List
      trajectoryList: [],
      // Details pop-up window
      detailVisible: false,
      detailLoading: false,
      trajectoryDetailList: [],
      // DetailsImageList
      detailImageList: [],
      // Date range
      dateRange: [],
      // Query params
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
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
    /** Query track list */
    getList() {
      this.loading = true;
      trajectoryPage(this.queryParams).then((response) => {
        this.trajectoryList = response.data.records;
        this.total = response.data.totalCount;
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
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
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
    /** Detail handler */
    handleDetail(row) {
      this.detailVisible = true;
      this.detailLoading = true;

      // Call the trajectory details interface
      const params = {
        recordUrl1: row.recordUrl1, // Customer ID
        taskName: row.taskName, // Track time period
        installationArea: this.queryParams.installationArea,
      };

      getTrajectory(params)
        .then((response) => {
          this.trajectoryDetailList = response.data || [];
          // Collect all ImageURLs for ImagePreview switching
          this.detailImageList = this.trajectoryDetailList
            .filter((item) => item.imageUrl)
            .map((item) => item.imageUrl);
          this.detailLoading = false;
        })
        .catch((error) => {
          console.error("Failed to fetch track details:", error);
          this.$message.error(this.$t("trajectoryQuery.getDetailFailed"));
          this.detailLoading = false;
        });
    },
    /** Get image index in preview list */
    getImageIndex(imageUrl) {
      return this.detailImageList.findIndex((url) => url === imageUrl);
    },
    /** Delete handler */
    handleDelete(row) {
      this.$confirm(
        this.$t("trajectoryQuery.confirmDelete") ,
        this.$t("common.warning") ,
        {
          confirmButtonText: this.$t("common.confirm") ,
          cancelButtonText: this.$t("common.cancel") ,
          type: "warning",
        }
      )
        .then(() => {
          const params = {
            recordUrl1: row.recordUrl1,
            taskName: row.taskName,
          };
          return delTrajectory(params);
        })
        .then(() => {
          this.$message.success(
            this.$t("trajectoryQuery.deleteSuccess")
          );
          this.getList();
        })
        .catch((error) => {
          if (error !== "cancel") {
            console.error("Deletefail:", error);
            this.$message.error(
              this.$t("trajectoryQuery.deleteFailed") 
            );
          }
        });
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
