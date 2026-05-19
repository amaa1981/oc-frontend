<template>
  <div class="data-center-page">
    <!-- 页面头部 -->
    <div class="data-header">
      <div class="data-header-left">
        <h2 class="page-title">{{ $t('dataCenter.dataScreen') }}</h2>
        <span class="header-time">{{ headerTime }}</span>
      </div>
      <div class="data-header-right">
        <!-- 切换天数 -->
        <div class="switch-days-box">
          <div
            class="switch-days-item"
            :class="{ active: type === '1' }"
            @click="switchType('1')"
          >{{ $t('dataCenter.today') }}</div>
          <div
            class="switch-days-item"
            :class="{ active: type === '2' }"
            @click="switchType('2')"
          >{{ $t('dataCenter.thisWeek') }}</div>
          <div
            class="switch-days-item"
            :class="{ active: type === '3' }"
            @click="switchType('3')"
          >{{ $t('dataCenter.last30Days') }}</div>
        </div>
        <el-button size="small" icon="el-icon-document" @click="handleAiReport">{{ $t('dataCenter.aiReport') }}</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">{{ $t('dataCenter.totalEvents') }}</span>
          <span class="stat-value">{{ todayEvent }}</span>
        </div>
        <div class="stat-icon">
          <img src="@/assets/images/data/image1.png" alt="" />
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">{{ $t('dataCenter.processedEvents') }}</span>
          <span class="stat-value processed">{{ todayEventHandled }}</span>
        </div>
        <div class="stat-icon">
          <img src="@/assets/images/data/image2.png" alt="" />
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">{{ $t('dataCenter.unprocessedEvents') }}</span>
          <span class="stat-value unprocessed">{{ todayEventUnHandled }}</span>
        </div>
        <div class="stat-icon">
          <img src="@/assets/images/data/image3.png" alt="" />
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">{{ $t('dataCenter.peopleCount') }}</span>
          <span class="stat-value">{{ peopleNum }}</span>
        </div>
        <div class="stat-icon">
          <img src="@/assets/images/data/image4.png" alt="" />
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">{{ $t('dataCenter.vehicleCount') }}</span>
          <span class="stat-value">{{ vehiclesNum }}</span>
        </div>
        <div class="stat-icon">
          <img src="@/assets/images/data/image5.png" alt="" />
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-section">
      <!-- 上排图表 -->
      <div class="chart-row-top">
        <div class="chart-card chart-left">
          <Left
            ref="leftChart"
            :title="switchDaysData.value"
            :data="dataList.leftData"
            :alarmTypeMapping="leftAlarmTypeMapping"
            :type="type"
          />
        </div>
        <div class="chart-card chart-center">
          <Right
            ref="rightChart"
            :title="switchDaysData.value"
            :data="dataList.rightData"
            :alarmTypeMapping="rightAlarmTypeMapping"
          />
        </div>
        <div class="chart-card chart-right2">
          <Right2
            ref="right2Chart"
            :title="switchDaysData.value"
            :data="dataList.vehiclesMapData"
            :alarmTypeMapping="vehiclesAlarmTypeMapping"
          />
        </div>
      </div>
      <!-- 下排图表 -->
      <div class="chart-row-bottom">
        <div class="chart-card chart-bottom-full">
          <div class="chart-bottom-title">{{ switchDaysData.value + $t('dataCenter.deviceAlarmTop3') }}</div>
          <div class="chart-bottom-grid">
            <Bottom
              ref="bottomChart1"
              color="#1FC6FF"
              :name="dataList.bottomOneTitle"
              :data="dataList.bottomOneData"
              :type="type"
              :alarmTypeMapping="bottomAlarmTypeMapping"
            />
            <Bottom
              ref="bottomChart2"
              color="#FFC600"
              :name="dataList.bottomTwoTitle"
              :data="dataList.bottomTwoData"
              :type="type"
              :alarmTypeMapping="bottomAlarmTypeMapping"
            />
            <Bottom
              ref="bottomChart3"
              color="#00FFA6"
              :name="dataList.bottomThreeTitle"
              :data="dataList.bottomThreeData"
              :type="type"
              :alarmTypeMapping="bottomAlarmTypeMapping"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- AI 总结报告弹窗 -->
    <AiReportDialog :visible.sync="aiReportVisible" :reportData="aiReportData" />
  </div>
</template>

<script>
import AiReportDialog from "@/components/AiReportDialog/index.vue";
import {
  getTrendChart,
  getTodayOverview,
  getDeviceTrendChart,
  getVehiclesNumber,
  getVehiclesMap,
} from "@/api/system/data";
import dayjs from "dayjs";
import Left from "./left/index.vue";
import Right from "./right/index.vue";
import Right2 from "./right2/index.vue";
import Bottom from "./bottom/index.vue";
export default {
  dicts: ["v1_alarm_type"],
  components: {
    AiReportDialog,
    Left,
    Right,
    Right2,
    Bottom,
  },
  name: "DataCenter",
  data() {
    return {
      type: "1",
      timer: null,
      timeTimer: null,
      headerTime: "",
      aiReportVisible: false,
      aiReportData: {},
      switchDaysData: {
        // 选中天数 对应key
        key: 1,
        // 选中天数 对应value
        value: this.$t('dataCenter.today'),
        // 选中天数对应预警总数
        total: 0,
        // 切换天数 数据源
        list: [
          { key: 1, value: this.$t('dataCenter.today') },
          { key: 2, value: this.$t('dataCenter.thisWeek') },
          { key: 3, value: this.$t('dataCenter.last30Days') },
        ],
      },
      dataList: {
        leftData: [],
        rightData: [],
        bottomOneTitle: "",
        bottomOneData: [],
        bottomTwoTitle: "",
        bottomTwoData: [],
        bottomThreeTitle: "",
        bottomThreeData: [],
        vehiclesMapData: [],
      },
      todayEvent: 0, //事件总数量
      todayEventClosed: 0, //误报事件数量
      todayEventHandled: 0, //已处理事件数量
      todayEventUnHandled: 0, //未处理事件数量
      peopleNum: 0, //人数
      vehiclesNum: 0, //车辆数量
      // 左侧饼图报警类型映射
      leftAlarmTypeMapping: {},
      // 右侧折线图报警类型映射
      rightAlarmTypeMapping: {},
      // 底部设备报警类型映射
      bottomAlarmTypeMapping: {},
    };
  },
  computed: {
    vehiclesAlarmTypeMapping() {
      return {
        [this.$t('dataCenter.people')]: '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F',
        [this.$t('dataCenter.vehicle')]: '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F',
      };
    },
  },
  created() {
    this.updateHeaderTime();
    this.timeTimer = setInterval(() => {
      this.updateHeaderTime();
    }, 1000);
    this.getTrendChart();
    this.timer = setInterval(() => {
      this.getTrendChart();
    }, 5 * 60 * 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.timeTimer) {
      clearInterval(this.timeTimer);
      this.timeTimer = null;
    }
  },
  methods: {
    updateHeaderTime() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const h = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const weekMap = [
        this.$t('dataCenter.sun'),
        this.$t('dataCenter.mon'),
        this.$t('dataCenter.tue'),
        this.$t('dataCenter.wed'),
        this.$t('dataCenter.thu'),
        this.$t('dataCenter.fri'),
        this.$t('dataCenter.sat')
      ];
      const w = weekMap[now.getDay()];
      this.headerTime = `${y}-${m}-${d} ${w} ${h}:${min}:${s}`;
    },
    handleAiReport() {
      // 组装设备Top3数据
      var topDevices = [];
      var devList = [
        { title: this.dataList.bottomOneTitle, data: this.dataList.bottomOneData },
        { title: this.dataList.bottomTwoTitle, data: this.dataList.bottomTwoData },
        { title: this.dataList.bottomThreeTitle, data: this.dataList.bottomThreeData },
      ];
      for (var i = 0; i < devList.length; i++) {
        if (devList[i].title && devList[i].data) {
          var sum = 0;
          for (var j = 0; j < devList[i].data.length; j++) {
            sum += devList[i].data[j].num || 0;
          }
          topDevices.push({ name: devList[i].title, total: sum });
        }
      }

      this.aiReportData = {
        timeLabel: this.switchDaysData.value,
        totalEvents: this.todayEvent,
        processedEvents: this.todayEventHandled,
        unprocessedEvents: this.todayEventUnHandled,
        peopleNum: this.peopleNum,
        vehiclesNum: this.vehiclesNum,
        eventTypes: this.dataList.leftData || [],
        trendData: this.dataList.rightData || [],
        vehiclesTrend: this.dataList.vehiclesMapData || [],
        topDevices: topDevices,
      };
      this.aiReportVisible = true;
    },
    switchType(type) {
      this.type = type;
      this.switchDaysData.key = type;
      this.switchDaysData.value = this.switchDaysData.list.find(
        (item) => item.key == type
      ).value;
      this.getTrendChart();
    },
    daysSinceDate(mmdd) {
      const [monthStr, dayStr] = mmdd.split("-");
      const month = parseInt(monthStr, 10) - 1; // JS月从0开始
      const day = parseInt(dayStr, 10);

      const today = new Date();
      const thisYear = today.getFullYear();

      let targetDate = new Date(thisYear, month, day);

      if (today < targetDate) {
        targetDate = new Date(thisYear - 1, month, day);
      }

      const msPerDay = 1000 * 60 * 60 * 24;
      const diffMs = today.setHours(0, 0, 0, 0) - targetDate.getTime();
      return 29 - Math.floor(diffMs / msPerDay);
    },
    getTrendChart() {
      this.dataList = {
        leftData: [],
        rightData: [],
        bottomOneTitle: "",
        bottomOneData: [],
        bottomTwoTitle: "",
        bottomTwoData: [],
        bottomThreeTitle: "",
        bottomThreeData: [],
        vehiclesMapData: [],
      };

      let startTime = "";
      let endTime = "";
      if (this.type == "1") {
        startTime = dayjs().format("YYYY-MM-DD");
        endTime = dayjs().format("YYYY-MM-DD");
      } else if (this.type == "2") {
        startTime = dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD");
        endTime = dayjs().endOf("week").add(1, "day").format("YYYY-MM-DD");
      } else if (this.type == "3") {
        startTime = dayjs().subtract(29, "days").format("YYYY-MM-DD");
        endTime = dayjs().format("YYYY-MM-DD");
      }

      //头部
      getTodayOverview({
        startTime: startTime + " 00:00:00",
        endTime: endTime + " 23:59:59",
      }).then((res) => {
        this.todayEvent = res.data.todayEvent;
        this.todayEventClosed = res.data.todayEventClosed;
        this.todayEventHandled = res.data.todayEventHandled;
        this.todayEventUnHandled = res.data.todayEventUnHandled;
      });
      //统计时间范围内的人数和车数量
      getVehiclesNumber({
        startTime: startTime + " 00:00:00",
        endTime: endTime + " 23:59:59",
        type: this.type,
      }).then((res) => {
        this.peopleNum = res.data.peopleNum;
        this.vehiclesNum = res.data.vehiclesNum;
      });
      //人车事件预警趋势图
      getVehiclesMap({
        type: this.type,
      }).then((res) => {
        console.log(res);
        // 处理vehiclesMapData，结构跟rightData一样
        let week = [];
        // 根据选择的时间类型生成横坐标数据
        if (this.type == "1") {
          // 本日，生成1-23小时
          for (let i = 0; i <= 23; i++) {
            week.push(i);
          }
        } else if (this.type == "2") {
          // 本周，生成1-7天
          for (let i = 0; i < 7; i++) {
            week.push(i);
          }
        } else if (this.type == "3") {
          // 获取最近30天日的数据
          const today = new Date();
          for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            week.push(date.getDate());
          }
        }

        let vehiclesMapData = [];
        // 创建人员和车辆两个数据系列
        vehiclesMapData.push({
          date_type: this.$t('dataCenter.people'),
          eventTypeId: "people",
          count: new Array(week.length).fill(0),
          week: week,
        });
        vehiclesMapData.push({
          date_type: this.$t('dataCenter.vehicle'),
          eventTypeId: "vehicles",
          count: new Array(week.length).fill(0),
          week: week,
        });

        // 填充数据
        if (res.data && res.data.length > 0) {
          res.data.forEach((item) => {
            const peopleItem = vehiclesMapData.find(
              (x) => x.eventTypeId === "people"
            );
            const vehiclesItem = vehiclesMapData.find(
              (x) => x.eventTypeId === "vehicles"
            );

            // 处理人员数量
            if (
              peopleItem &&
              item.peopleNum !== undefined &&
              item.peopleNum !== null
            ) {
              if (this.type == "1") {
                peopleItem.count[item.time] = item.peopleNum;
              } else if (this.type == "2") {
                peopleItem.count[item.time - 1] = item.peopleNum;
              } else if (this.type == "3") {
                const index = this.daysSinceDate(item.time);
                peopleItem.count[index] = item.peopleNum;
              }
            }

            // 处理车辆数量
            if (
              vehiclesItem &&
              item.vehiclesNum !== undefined &&
              item.vehiclesNum !== null
            ) {
              if (this.type == "1") {
                vehiclesItem.count[item.time] = item.vehiclesNum;
              } else if (this.type == "2") {
                vehiclesItem.count[item.time - 1] = item.vehiclesNum;
              } else if (this.type == "3") {
                const index = this.daysSinceDate(item.time);
                vehiclesItem.count[index] = item.vehiclesNum;
              }
            }
          });
        }

        this.dataList.vehiclesMapData = vehiclesMapData;
      });
      //底部统计
      getDeviceTrendChart({
        type: this.type,
      }).then((res) => {
        for (let index = 0; index < res.data.length; index++) {
          if (index == 0) {
            this.dataList.bottomOneTitle = res.data[index].deviceName;
            this.dataList.bottomOneData = res.data[index].deviceAlarmList;
          } else if (index == 1) {
            this.dataList.bottomTwoTitle = res.data[index].deviceName;
            this.dataList.bottomTwoData = res.data[index].deviceAlarmList;
          } else if (index == 2) {
            this.dataList.bottomThreeTitle = res.data[index].deviceName;
            this.dataList.bottomThreeData = res.data[index].deviceAlarmList;
          }
        }

        // 构建底部设备报警类型映射
        this.bottomAlarmTypeMapping = {};
        res.data.forEach((item) => {
          // 这里可以根据设备名称映射到对应的报警类型ID
          // 暂时使用一个通用的报警类型ID，实际使用时可以根据需要调整
          this.bottomAlarmTypeMapping[item.deviceName] =
            "1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F";
        });
      });

      getTrendChart({
        type: this.type,
      }).then((res) => {
        //左边数据
        const leftData = res.data.map((item) => {
          return {
            value: item.num,
            name: this.$t(`dict.v1_alarm_type.${item.eventTypeId}`) || this.$t('dataCenter.unknown'),
            id: item.eventTypeId,
          };
        });
        // 将相同name的数据聚合在一起
        const aggregatedData = [];
        leftData.forEach((item) => {
          const existingItem = aggregatedData.find((x) => x.name === item.name);
          if (existingItem) {
            existingItem.value += item.value;
          } else {
            aggregatedData.push({ ...item });
          }
        });
        // 使用聚合后的数据（过滤掉 value 为 0 的项）
        this.dataList.leftData = aggregatedData.filter(item => item.value > 0)

        // 构建左侧饼图报警类型映射
        this.leftAlarmTypeMapping = {};
        aggregatedData.forEach((item) => {
          this.leftAlarmTypeMapping[item.name] = item.id;
        });

        //右边数据
        let week = [];
        //switchDaysData.key 1: 本日 2: 本周 3: 本月
        // 根据选择的时间类型生成横坐标数据
        if (this.type == "1") {
          // 本日，生成1-23小时
          for (let i = 0; i <= 23; i++) {
            week.push(i);
          }
        } else if (this.type == "2") {
          // 本周，生成1-7天
          for (let i = 0; i < 7; i++) {
            week.push(i);
          }
        } else if (this.type == "3") {
          // 获取最近30天日的数据
          const today = new Date();
          for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            week.push(date.getDate());
          }
        }
        let rightData = [];
        this.dataList.leftData.forEach((item) => {
          rightData.push({
            date_type: item.name,
            eventTypeId: item.id,
            count: new Array(week.length).fill(0),
            week: week,
          });
        });
        res.data.forEach((item) => {
          const rightItem = rightData.find(
            (x) => x.eventTypeId === item.eventTypeId
          );
          if (rightItem) {
            if (this.type == "1") {
              rightItem.count[item.time] = item.num;
            } else if (this.type == "2") {
              rightItem.count[item.time - 1] = item.num;
            } else if (this.type == "3") {
              // 计算item.time格式最近第几天
              const index = this.daysSinceDate(item.time);
              rightItem.count[index] = item.num;
            }
          }
        });
        this.dataList.rightData = rightData;

        // 构建右侧折线图报警类型映射
        this.rightAlarmTypeMapping = {};
        rightData.forEach((item) => {
          this.rightAlarmTypeMapping[item.date_type] = item.eventTypeId;
        });
      });
    },
  },
};
</script>



<style lang="scss" scoped>
.data-center-page {
  padding: 0px;
  min-height: calc(100vh - 84px);
}

.data-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .data-header-left {
    display: flex;
    align-items: baseline;
    gap: 16px;

    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a2a36;
      margin: 0;
    }

    .header-time {
      font-size: 13px;
      color: #8c9bab;
    }
  }

  .data-header-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .switch-days-box {
      display: flex;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e4e7ed;

      .switch-days-item {
        padding: 6px 16px;
        font-size: 13px;
        color: #606266;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;

        &:hover {
          color: #1a7a6e;
          background: #f0faf8;
        }

        &.active {
          background: #1a7a6e;
          color: #fff;
          pointer-events: none;
        }
      }
    }
  }
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  .stat-card {
   background: radial-gradient( 107.99% 104.29% at 106.57% -3.85%, rgba(35,135,135,0.2) 0%, rgba(255,255,255,0) 100%), #FFFFFF;
box-shadow: 0px 1px 4px -1px rgba(13,13,18,0.06);
border-radius: 24px 24px 24px 24px;
border: 1px solid #FFFFFF;

    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 110px;

    .stat-info {
      display: flex;
      flex-direction: column;

      .stat-label {
        font-size: 14px;
        color: #5a6b7b;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .stat-value {
        font-size: 36px;
        font-weight: 700;
        color: #1a2a36;
        line-height: 1.1;

        &.processed {
          color: #1a2a36;
        }

        &.unprocessed {
          color: #1a2a36;
        }
      }
    }

    .stat-icon {
      flex-shrink: 0;
      width: 56px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        mix-blend-mode: multiply;
      }
    }
  }
}

.chart-section {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .chart-row-top {
    display: flex;
    gap: 16px;
    min-height: 380px;

    .chart-left {
      flex: 1;
    }

    .chart-center {
      flex: 2;
    }

    .chart-right2 {
      flex: 2;
    }
  }

  .chart-row-bottom {
    .chart-bottom-full {
      .chart-bottom-title {
        font-size: 16px;
        font-weight: 600;
        color: #1a2a36;
        margin-bottom: 12px;
      }

      .chart-bottom-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        min-height: 260px;
      }
    }
  }

  .chart-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }
}
</style>
