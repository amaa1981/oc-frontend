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

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="trajectoryList">
      <el-table-column
        :label="$t('shopStatistics.serialNumber')"
        align="center"
        type="index"
        width="80"
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
            @click="handleDetail(scope.row)"
            >{{ $t("trajectoryQuery.detail") }}</el-button
          >
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            style="color: #f56c6c"
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

    <!-- 详情弹窗 -->
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
        :label="$t('trajectoryQuery.equipmentName')"
        align="center"
        prop="equipmentName"
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
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 轨迹列表
      trajectoryList: [],
      // 详情弹窗
      detailVisible: false,
      detailLoading: false,
      trajectoryDetailList: [],
      // 详情图片列表
      detailImageList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
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
    /** 查询轨迹列表 */
    getList() {
      this.loading = true;
      trajectoryPage(this.queryParams).then((response) => {
        this.trajectoryList = response.data.records;
        this.total = response.data.totalCount;
        this.loading = false;
      });
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
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
      this.handleQuery();
    },
    /** 日期范围变化处理 */
    handleDateRangeChange(val) {
      if (val) {
        this.queryParams.startTime = val[0];
        this.queryParams.endTime = val[1];
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.detailVisible = true;
      this.detailLoading = true;

      // 调用轨迹详情接口
      const params = {
        recordUrl1: row.recordUrl1, // 客户id
        taskName: row.taskName, // 轨迹时间段
        installationArea: this.queryParams.installationArea,
      };

      getTrajectory(params)
        .then((response) => {
          this.trajectoryDetailList = response.data || [];
          // 收集所有图片URL用于图片预览切换
          this.detailImageList = this.trajectoryDetailList
            .filter((item) => item.imageUrl)
            .map((item) => item.imageUrl);
          this.detailLoading = false;
        })
        .catch((error) => {
          console.error("获取轨迹详情失败:", error);
          this.$message.error(this.$t("trajectoryQuery.getDetailFailed"));
          this.detailLoading = false;
        });
    },
    /** 获取图片在预览列表中的索引 */
    getImageIndex(imageUrl) {
      return this.detailImageList.findIndex((url) => url === imageUrl);
    },
    /** 删除按钮操作 */
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
            console.error("删除失败:", error);
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
