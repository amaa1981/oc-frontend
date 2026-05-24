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
      <el-row :gutter="20" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <i class="el-icon-s-custom"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ $t("shopStatistics.todayPassFlow") }}
              </div>
              <div class="card-panel-num">{{ todayData.passNum || 0 }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shopping">
              <i class="el-icon-shopping-bag-1"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ $t("shopStatistics.todayEnterFlow") }}
              </div>
              <div class="card-panel-num">{{ todayData.enterNum || 0 }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
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

    <!-- Today's data display -->

    <!-- Table display -->

    <el-table v-loading="loading" :data="shopCountList">
      <el-table-column
        :label="$t('shopStatistics.serialNumber')"
        align="center"
        type="index"
        width="50"
      />
      <el-table-column
        :label="$t('shopStatistics.date')"
        align="center"
        prop="dateTime"
      />
      <el-table-column
        :label="$t('shopStatistics.passFlow')"
        align="center"
        prop="passNum"
      />
      <el-table-column
        :label="$t('shopStatistics.enterFlow')"
        align="center"
        prop="enterNum"
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
import { getShopCountPage, getShopCountToday } from "@/api/alarm/record";
import { delRecord } from "@/api/system/record";
import echarts from "@/plugins/echarts";

export default {
  name: "ShopCount",
  dicts: ["v1_device_area"],
  data() {
    return {
      // Loading
      loading: true,
      // Show search
      showSearch: true,
      // Total count
      total: 0,
      // Passenger flow statistics list
      shopCountList: [],
      // Today's data
      todayData: {
        passNum: 0,
        enterNum: 0,
        dateTime: "",
      },
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
      // Chart example
      chartInstance: null,
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
  computed: {
    // Passenger flow
    totalPassNum() {
      return this.shopCountList.reduce((sum, item) => sum + item.passNum, 0);
    },
    // Total in-store customer flow
    totalEnterNum() {
      return this.shopCountList.reduce((sum, item) => sum + item.enterNum, 0);
    },
    // Average store entry rate
    avgEnterRate() {
      if (this.totalPassNum === 0) return "0%";
      return ((this.totalEnterNum / this.totalPassNum) * 100).toFixed(2) + "%";
    },
  },
  created() {
    this.getTodayData();
    this.getList();
    // Monitor device area changes
    this.$bus.$on('installationAreaChange', this.onInstallationAreaChange);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
    // Remove listening
    this.$bus.$off('installationAreaChange', this.onInstallationAreaChange);
  },
  mounted() {
    window.addEventListener("resize", this.resizeChart);
  },
  methods: {
    // Device area change processing
    onInstallationAreaChange(val) {
      this.queryParams.installationArea = val || null;
      this.getTodayData();
      this.handleQuery();
    },
    /** Get today data */
    getTodayData() {
      const params = {
        installationArea: this.queryParams.installationArea
      };
      getShopCountToday(params)
        .then((response) => {
          if (response.data) {
            this.todayData = {
              passNum: response.data.passNum || 0,
              enterNum: response.data.enterNum || 0,
              dateTime: new Date().toISOString().slice(0, 10),
            };
          } else {
            this.todayData = {
              passNum: 0,
              enterNum: 0,
              dateTime: new Date().toISOString().slice(0, 10),
            };
          }
        })
        .catch((error) => {
          console.error("Failed to fetch today's data:", error);
          this.todayData = {
            passNum: 0,
            enterNum: 0,
            dateTime: new Date().toISOString().slice(0, 10),
          };
        });
    },
    /** Query traffic statistics list */
    getList() {
      this.loading = true;
      getShopCountPage(this.queryParams).then((response) => {
        let records = response.data.records || [];

        // If no time range is set, make sure today's data is first
        // if (!this.queryParams.startTime && !this.queryParams.endTime) {
        //   // Filter out today's data (if it already exists)
        //   const today = new Date().toISOString().slice(0, 10);
        //   records = records.filter((item) => !item.dateTime.startsWith(today));

        //   //Insert today's data to the first position
        //   if (
        //     this.todayData &&
        //     (this.todayData.passNum > 0 || this.todayData.enterNum > 0)
        //   ) {
        //     records.unshift(this.todayData);
        //   }
        // }

        this.shopCountList = records;
        this.total = response.data.totalCount;
        this.loading = false;
        this.$nextTick(() => {
          this.initChart();
        });
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
      this.getTodayData();
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
    /** Calculate store entry rate */
    calculateRate(enterNum, passNum) {
      if (!passNum || passNum === 0) {
        return "0%";
      }
      const rate = ((enterNum / passNum) * 100).toFixed(2);
      return rate + "%";
    },
    /** Initialize chart */
    initChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      // Prepare data
      const dateList = this.shopCountList.map((item) => item.dateTime);
      const passNumList = this.shopCountList.map((item) => item.passNum);
      const enterNumList = this.shopCountList.map((item) => item.enterNum);

      // Initialize chart
      this.chartInstance = echarts.init(this.$refs.shopFlowChart);

      // Configure chart options
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["Passing Traffic", "Store Entry Traffic"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: dateList,
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: "value",
          name: "People Count",
        },
        series: [
          {
            name: "Passing Traffic",
            type: "bar",
            data: passNumList,
            itemStyle: {
              color: "#409EFF",
            },
          },
          {
            name: "Store Entry Traffic",
            type: "bar",
            data: enterNumList,
            itemStyle: {
              color: "#67C23A",
            },
          },
          {
            name: "Entry Rate",
            type: "line",
            yAxisIndex: 0,
            data: this.shopCountList.map((item) => {
              if (!item.passNum) return 0;
              return ((item.enterNum / item.passNum) * 100).toFixed(2);
            }),
            itemStyle: {
              color: "#E6A23C",
            },
          },
        ],
      };

      // Set chart options
      this.chartInstance.setOption(option);
    },
    /** Resize chart */
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize();
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
.panel-group {
  margin-top: 18px;
  margin-bottom: 18px;
}

.card-panel-col {
  margin-bottom: 12px;
}

.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  transition: all 0.3s ease;
}

.card-panel:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-panel-icon-wrapper i {
  font-size: 48px;
  color: #fff;
}

.icon-people {
  background: linear-gradient(315deg, #4facfe 0%, #00f2fe 74%);
}

.icon-shopping {
  background: linear-gradient(315deg, #fa709a 0%, #fee140 74%);
}

.icon-rate {
  background: linear-gradient(315deg, #667eea 0%, #764ba2 74%);
}

.icon-time {
  background: linear-gradient(315deg, #ffecd2 0%, #fcb69f 74%);
}

.card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px 26px 26px 0;
  text-align: right;
}

.card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel-num {
  font-size: 24px;
  font-weight: bold;
  color: #666;
  text-align: center;
  padding: 10px 0;
}

.chart-wrapper {
  background: #fff;
  padding: 10px;
}

.el-table .cell {
  padding: 8px 12px;
}
</style>
