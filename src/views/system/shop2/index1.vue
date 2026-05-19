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
          range-separator="至"
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

    <!-- 今日数据展示 -->

    <!-- 表格展示 -->

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
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客流统计列表
      shopCountList: [],
      // 今日数据
      todayData: {
        passNum: 0,
        enterNum: 0,
        dateTime: "",
      },
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
      // 图表实例
      chartInstance: null,
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
  computed: {
    // 总经过客流
    totalPassNum() {
      return this.shopCountList.reduce((sum, item) => sum + item.passNum, 0);
    },
    // 总进店客流
    totalEnterNum() {
      return this.shopCountList.reduce((sum, item) => sum + item.enterNum, 0);
    },
    // 平均进店率
    avgEnterRate() {
      if (this.totalPassNum === 0) return "0%";
      return ((this.totalEnterNum / this.totalPassNum) * 100).toFixed(2) + "%";
    },
  },
  created() {
    this.getTodayData();
    this.getList();
    // 监听设备区域变化
    this.$bus.$on('installationAreaChange', this.onInstallationAreaChange);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
    // 移除监听
    this.$bus.$off('installationAreaChange', this.onInstallationAreaChange);
  },
  mounted() {
    window.addEventListener("resize", this.resizeChart);
  },
  methods: {
    // 设备区域变化处理
    onInstallationAreaChange(val) {
      this.queryParams.installationArea = val || null;
      this.getTodayData();
      this.handleQuery();
    },
    /** 获取今日数据 */
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
          console.error("获取今日数据失败:", error);
          this.todayData = {
            passNum: 0,
            enterNum: 0,
            dateTime: new Date().toISOString().slice(0, 10),
          };
        });
    },
    /** 查询客流统计列表 */
    getList() {
      this.loading = true;
      getShopCountPage(this.queryParams).then((response) => {
        let records = response.data.records || [];

        // 如果没有设置时间范围，确保今日数据在第一位
        // if (!this.queryParams.startTime && !this.queryParams.endTime) {
        //   // 过滤掉今日数据（如果已存在）
        //   const today = new Date().toISOString().slice(0, 10);
        //   records = records.filter((item) => !item.dateTime.startsWith(today));

        //   // 将今日数据插入到第一位
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
      this.getTodayData();
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
    /** 计算进店率 */
    calculateRate(enterNum, passNum) {
      if (!passNum || passNum === 0) {
        return "0%";
      }
      const rate = ((enterNum / passNum) * 100).toFixed(2);
      return rate + "%";
    },
    /** 初始化图表 */
    initChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      // 准备数据
      const dateList = this.shopCountList.map((item) => item.dateTime);
      const passNumList = this.shopCountList.map((item) => item.passNum);
      const enterNumList = this.shopCountList.map((item) => item.enterNum);

      // 初始化图表
      this.chartInstance = echarts.init(this.$refs.shopFlowChart);

      // 配置图表选项
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["经过客流", "进店客流"],
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
          name: "人数",
        },
        series: [
          {
            name: "经过客流",
            type: "bar",
            data: passNumList,
            itemStyle: {
              color: "#409EFF",
            },
          },
          {
            name: "进店客流",
            type: "bar",
            data: enterNumList,
            itemStyle: {
              color: "#67C23A",
            },
          },
          {
            name: "进店率",
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

      // 设置图表选项
      this.chartInstance.setOption(option);
    },
    /** 调整图表大小 */
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
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
