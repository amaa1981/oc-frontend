<template>
  <div class="data-center-page">
    <!-- Page Header -->
    <div class="data-header">
      <div class="data-header-left">
        <h2 class="page-title">{{ $t('dataCenter.dataScreen') }}</h2>
        <span class="header-time">{{ headerTime }}</span>
      </div>
      <div class="data-header-right">
        <div class="switch-days-box">
          <div class="switch-days-item" :class="{ active: type === '1' }" @click="switchType('1')">Today</div>
          <div class="switch-days-item" :class="{ active: type === '2' }" @click="switchType('2')">This Week</div>
          <div class="switch-days-item" :class="{ active: type === '3' }" @click="switchType('3')">Last 30 Days</div>
        </div>
        <el-button size="small" icon="el-icon-document" @click="handleAiReport">AI Report</el-button>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Total Events</span>
          <span class="stat-value">{{ todayEvent }}</span>
        </div>
        <div class="stat-icon"><img src="@/assets/images/data/image1.png" alt="" /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Processed Events</span>
          <span class="stat-value processed">{{ todayEventHandled }}</span>
        </div>
        <div class="stat-icon"><img src="@/assets/images/data/image2.png" alt="" /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Unprocessed Events</span>
          <span class="stat-value unprocessed">{{ todayEventUnHandled }}</span>
        </div>
        <div class="stat-icon"><img src="@/assets/images/data/image3.png" alt="" /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">People Count</span>
          <span class="stat-value">{{ peopleNum }}</span>
        </div>
        <div class="stat-icon"><img src="@/assets/images/data/image4.png" alt="" /></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Vehicle Count</span>
          <span class="stat-value">{{ vehiclesNum }}</span>
        </div>
        <div class="stat-icon"><img src="@/assets/images/data/image5.png" alt="" /></div>
      </div>
    </div>

    <!-- Charts -->
    <div class="chart-section">
      <!-- Top Row -->
      <div class="chart-row-top">
        <div class="chart-card chart-left">
          <Left ref="leftChart" :title="switchDaysData.value" :data="dataList.leftData" :alarmTypeMapping="leftAlarmTypeMapping" :type="type" />
        </div>
        <div class="chart-card chart-center">
          <Right ref="rightChart" :title="switchDaysData.value" :data="dataList.rightData" :alarmTypeMapping="rightAlarmTypeMapping" />
        </div>
        <div class="chart-card chart-right2">
          <Right2 ref="right2Chart" :title="switchDaysData.value" :data="dataList.vehiclesMapData" :alarmTypeMapping="vehiclesAlarmTypeMapping" />
        </div>
      </div>
      <!-- Bottom Row -->
      <div class="chart-row-bottom">
        <div class="chart-card chart-bottom-full">
          <div class="chart-bottom-title">{{ switchDaysData.value + ' Top 3 Device Alarms' }}</div>
          <div class="chart-bottom-grid">
            <Bottom ref="bottomChart1" color="#1FC6FF" :name="dataList.bottomOneTitle" :data="dataList.bottomOneData" :type="type" :alarmTypeMapping="bottomAlarmTypeMapping" />
            <Bottom ref="bottomChart2" color="#FFC600" :name="dataList.bottomTwoTitle" :data="dataList.bottomTwoData" :type="type" :alarmTypeMapping="bottomAlarmTypeMapping" />
            <Bottom ref="bottomChart3" color="#00FFA6" :name="dataList.bottomThreeTitle" :data="dataList.bottomThreeData" :type="type" :alarmTypeMapping="bottomAlarmTypeMapping" />
          </div>
        </div>
      </div>
    </div>

    <!-- AI Report Dialog -->
    <AiReportDialog :visible.sync="aiReportVisible" :reportData="aiReportData" />
  </div>
</template>

<script>
import AiReportDialog from "@/components/AiReportDialog/index.vue";
import { getTrendChart, getTodayOverview, getDeviceTrendChart, getVehiclesNumber, getVehiclesMap } from "@/api/system/data";
import dayjs from "dayjs";
import Left from "./left/index.vue";
import Right from "./right/index.vue";
import Right2 from "./right2/index.vue";
import Bottom from "./bottom/index.vue";

export default {
  dicts: ["v1_alarm_type"],
  components: { AiReportDialog, Left, Right, Right2, Bottom },
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
        key: 1,
        value: "Today",
        total: 0,
        list: [
          { key: 1, value: "Today" },
          { key: 2, value: "This Week" },
          { key: 3, value: "Last 30 Days" },
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
      todayEvent: 0,
      todayEventClosed: 0,
      todayEventHandled: 0,
      todayEventUnHandled: 0,
      peopleNum: 0,
      vehiclesNum: 0,
      leftAlarmTypeMapping: {},
      rightAlarmTypeMapping: {},
      bottomAlarmTypeMapping: {},
    };
  },
  computed: {
    vehiclesAlarmTypeMapping() {
      return {
        "People": '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F',
        "Vehicle": '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F',
      };
    },
  },
  created() {
    this.updateHeaderTime();
    this.timeTimer = setInterval(() => { this.updateHeaderTime(); }, 1000);
    this.getTrendChart();
    this.timer = setInterval(() => { this.getTrendChart(); }, 5 * 60 * 1000);
  },
  beforeDestroy() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.timeTimer) { clearInterval(this.timeTimer); this.timeTimer = null; }
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
      const weekMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const w = weekMap[now.getDay()];
      this.headerTime = `${y}-${m}-${d} ${w} ${h}:${min}:${s}`;
    },
    handleAiReport() {
      var topDevices = [];
      var devList = [
        { title: this.dataList.bottomOneTitle, data: this.dataList.bottomOneData },
        { title: this.dataList.bottomTwoTitle, data: this.dataList.bottomTwoData },
        { title: this.dataList.bottomThreeTitle, data: this.dataList.bottomThreeData },
      ];
      for (var i = 0; i < devList.length; i++) {
        if (devList[i].title && devList[i].data) {
          var sum = 0;
          for (var j = 0; j < devList[i].data.length; j++) { sum += devList[i].data[j].num || 0; }
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
      this.switchDaysData.value = this.switchDaysData.list.find(item => item.key == type).value;
      this.getTrendChart();
    },
    daysSinceDate(mmdd) {
      const [monthStr, dayStr] = mmdd.split("-");
      const month = parseInt(monthStr, 10) - 1;
      const day = parseInt(dayStr, 10);
      const today = new Date();
      let targetDate = new Date(today.getFullYear(), month, day);
      if (today < targetDate) targetDate = new Date(today.getFullYear() - 1, month, day);
      const diffMs = today.setHours(0,0,0,0) - targetDate.getTime();
      return 29 - Math.floor(diffMs / (1000 * 60 * 60 * 24));
    },
    getTrendChart() {
      this.dataList = {
        leftData: [], rightData: [],
        bottomOneTitle: "", bottomOneData: [],
        bottomTwoTitle: "", bottomTwoData: [],
        bottomThreeTitle: "", bottomThreeData: [],
        vehiclesMapData: [],
      };

      let startTime = "", endTime = "";
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

      getTodayOverview({ startTime: startTime + " 00:00:00", endTime: endTime + " 23:59:59" }).then((res) => {
        this.todayEvent = res.data.todayEvent;
        this.todayEventClosed = res.data.todayEventClosed;
        this.todayEventHandled = res.data.todayEventHandled;
        this.todayEventUnHandled = res.data.todayEventUnHandled;
      });

      getVehiclesNumber({ startTime: startTime + " 00:00:00", endTime: endTime + " 23:59:59", type: this.type }).then((res) => {
        this.peopleNum = res.data.peopleNum;
        this.vehiclesNum = res.data.vehiclesNum;
      });

      getVehiclesMap({ type: this.type }).then((res) => {
        let week = [];
        if (this.type == "1") { for (let i = 0; i <= 23; i++) week.push(i); }
        else if (this.type == "2") { for (let i = 0; i < 7; i++) week.push(i); }
        else if (this.type == "3") {
          const today = new Date();
          for (let i = 29; i >= 0; i--) { const d = new Date(today); d.setDate(today.getDate() - i); week.push(d.getDate()); }
        }
        let vehiclesMapData = [
          { date_type: "People", eventTypeId: "people", count: new Array(week.length).fill(0), week },
          { date_type: "Vehicle", eventTypeId: "vehicles", count: new Array(week.length).fill(0), week },
        ];
        if (res.data && res.data.length > 0) {
          res.data.forEach((item) => {
            const peopleItem = vehiclesMapData.find(x => x.eventTypeId === "people");
            const vehiclesItem = vehiclesMapData.find(x => x.eventTypeId === "vehicles");
            if (peopleItem && item.peopleNum != null) {
              if (this.type == "1") peopleItem.count[item.time] = item.peopleNum;
              else if (this.type == "2") peopleItem.count[item.time - 1] = item.peopleNum;
              else peopleItem.count[this.daysSinceDate(item.time)] = item.peopleNum;
            }
            if (vehiclesItem && item.vehiclesNum != null) {
              if (this.type == "1") vehiclesItem.count[item.time] = item.vehiclesNum;
              else if (this.type == "2") vehiclesItem.count[item.time - 1] = item.vehiclesNum;
              else vehiclesItem.count[this.daysSinceDate(item.time)] = item.vehiclesNum;
            }
          });
        }
        this.dataList.vehiclesMapData = vehiclesMapData;
      });

      getDeviceTrendChart({ type: this.type }).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (i == 0) { this.dataList.bottomOneTitle = res.data[i].deviceName; this.dataList.bottomOneData = res.data[i].deviceAlarmList; }
          else if (i == 1) { this.dataList.bottomTwoTitle = res.data[i].deviceName; this.dataList.bottomTwoData = res.data[i].deviceAlarmList; }
          else if (i == 2) { this.dataList.bottomThreeTitle = res.data[i].deviceName; this.dataList.bottomThreeData = res.data[i].deviceAlarmList; }
        }
        this.bottomAlarmTypeMapping = {};
        res.data.forEach(item => { this.bottomAlarmTypeMapping[item.deviceName] = "1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F"; });
      });

      getTrendChart({ type: this.type }).then((res) => {
        const leftData = res.data.map(item => ({
          value: item.num,
          name: this.$t(`dict.v1_alarm_type.${item.eventTypeId}`) || item.eventTypeId,
          id: item.eventTypeId,
        }));
        const aggregatedData = [];
        leftData.forEach(item => {
          const existing = aggregatedData.find(x => x.name === item.name);
          if (existing) existing.value += item.value;
          else aggregatedData.push({ ...item });
        });
        this.dataList.leftData = aggregatedData.filter(item => item.value > 0);
        this.leftAlarmTypeMapping = {};
        aggregatedData.forEach(item => { this.leftAlarmTypeMapping[item.name] = item.id; });

        let week = [];
        if (this.type == "1") { for (let i = 0; i <= 23; i++) week.push(i); }
        else if (this.type == "2") { for (let i = 0; i < 7; i++) week.push(i); }
        else if (this.type == "3") {
          const today = new Date();
          for (let i = 29; i >= 0; i--) { const d = new Date(today); d.setDate(today.getDate() - i); week.push(d.getDate()); }
        }

        let rightData = [];
        this.dataList.leftData.forEach(item => {
          rightData.push({ date_type: item.name, eventTypeId: item.id, count: new Array(week.length).fill(0), week });
        });
        res.data.forEach(item => {
          // Skip summary items
          if (item.time === -1 || item.time === "-1") return;
          const rightItem = rightData.find(x => x.eventTypeId === item.eventTypeId);
          if (rightItem) {
            if (this.type == "1") {
              if (typeof item.time === "number") rightItem.count[item.time] = item.num;
            } else if (this.type == "2") {
              if (typeof item.time === "number") rightItem.count[item.time - 1] = item.num;
            } else {
              const idx = this.daysSinceDate(item.time);
              if (idx >= 0 && idx < 30) rightItem.count[idx] = item.num;
            }
          }
        });
        this.dataList.rightData = rightData;
        this.rightAlarmTypeMapping = {};
        rightData.forEach(item => { this.rightAlarmTypeMapping[item.date_type] = item.eventTypeId; });
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
  flex-wrap: wrap;
  gap: 12px;

  .data-header-left {
    display: flex;
    align-items: baseline;
    gap: 16px;
    flex-wrap: wrap;

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
    flex-wrap: wrap;

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

        &:hover { color: #1a7a6e; background: #f0faf8; }
        &.active { background: #1a7a6e; color: #fff; pointer-events: none; }
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
    background: radial-gradient(107.99% 104.29% at 106.57% -3.85%, rgba(35,135,135,0.2) 0%, rgba(255,255,255,0) 100%), #FFFFFF;
    box-shadow: 0px 1px 4px -1px rgba(13,13,18,0.06);
    border-radius: 24px;
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
      }
    }

    .stat-icon {
      flex-shrink: 0;
      width: 56px;
      height: 56px;

      img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
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

    .chart-left { flex: 1; }
    .chart-center { flex: 2; }
    .chart-right2 { flex: 2; }
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

/* ===== RESPONSIVE ===== */
@media (max-width: 1400px) {
  .stat-cards {
    grid-template-columns: repeat(3, 1fr);

    .stat-card:nth-child(4),
    .stat-card:nth-child(5) {
      grid-column: span 1;
    }
  }
}

@media (max-width: 1100px) {
  .chart-row-top {
    flex-wrap: wrap !important;
    min-height: auto !important;

    .chart-left { flex: 1 1 100% !important; min-height: 300px; }
    .chart-center { flex: 1 1 calc(50% - 8px) !important; min-height: 300px; }
    .chart-right2 { flex: 1 1 calc(50% - 8px) !important; min-height: 300px; }
  }

  .chart-bottom-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 900px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-row-top {
    flex-direction: column !important;

    .chart-left,
    .chart-center,
    .chart-right2 {
      flex: 1 1 100% !important;
      min-height: 280px;
    }
  }

  .chart-bottom-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 600px) {
  .stat-cards {
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    .stat-card {
      padding: 14px 16px !important;
      min-height: 80px !important;
      border-radius: 16px !important;

      .stat-value { font-size: 24px !important; }
      .stat-label { font-size: 11px !important; margin-bottom: 4px !important; }
      .stat-icon { width: 36px !important; height: 36px !important; }
    }
  }

  .data-header {
    .data-header-right {
      width: 100%;
      justify-content: space-between;

      .switch-days-box {
        flex: 1;

        .switch-days-item { padding: 6px 10px !important; font-size: 12px !important; }
      }
    }
  }

  .page-title { font-size: 16px !important; }
  .header-time { font-size: 11px !important; }

  .chart-card { padding: 12px !important; }
  .chart-bottom-title { font-size: 14px !important; }
}
</style>