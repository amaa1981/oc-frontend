<!--
 * @Author: ZWJ
 * @Date: 2024-03-13 17:31:22
 * @LastEditTime: 2025-10-09 11:02:03
 * @LastEditors: FGJ
 * @Description: Left side type analysis module
-->
<template>
  <div class="left-container">
    <!-- Title -->
    <div class="chart-header">
      <span class="chart-header__bar" />
      <span class="chart-header__name">{{ title }}</span>
      <span class="chart-header__sub">{{ $t('dataCenter.eventTypeAnalysis') }}</span>
    </div>
    <!-- sheet -->
    <div class="left-container-echarts" ref="leftEcharts"></div>
    <!-- No data -->
    <div v-show="!Boolean(data.length)" class="empty-state">
      <span>{{ $t('dataCenter.noData') }}</span>
    </div>
  </div>
</template>

<script>
// Title component
// echarts
import echarts from "@/plugins/echarts";

export default {
  name: "LeftContainer",
  components: {
  },
  props: {
    // Title
    title: {
      type: String,
      default: "",
    },
    // data
    data: {
      type: Array,
      default: () => [],
    },
    // Alarm type ID mapping relationship
    alarmTypeMapping: {
      type: Object,
      default: () => ({}),
    },
    // Time Type 1: Today 2: This week 3: Last 30 days
    type: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      // initializeecharts
      eCharts: null,
    };
  },
  watch: {
    data: {
      handler(value) {
        // Cancel monitoring
        window.removeEventListener("resize", this.echartsSize);
        // Destroy form
        this.eCharts?.dispose();
        // Reset is null
        this.eCharts = null;

        // If there is data, initialize the content
        if (value.length !== 0) {
          // Initialization form
          this.$nextTick(() => {
            this.initEcharts();
          });
        }
      },
      deep: true,
      // immediate: true, // Add immediate attribute to ensure that the listening function is executed immediately when the component is created
    },
  },
  mounted() {
    // Add window size change monitoring
    window.addEventListener("resize", this.echartsSize);
  },
  beforeDestroy() {
    // Cancel monitoring
    window.removeEventListener("resize", this.echartsSize);
  },
  methods: {
    // echartsEdit size method
    echartsSize() {
      // Resetecharts size
      this.eCharts?.resize();
    },
    // Handling chart click events
    handleChartClick(params) {
      // Get the clicked data series name
      const seriesName = params.name;

      // Get the corresponding alarm type ID from the mapping relationship
      const eventTypeId = this.alarmTypeMapping[seriesName];

      // Build jump parameters
      const query = {};
      if (eventTypeId) {
        query.eventTypeId = eventTypeId;
      }

      // Add time parameter
      if (this.type === "2") {
        // This week's data
        const today = new Date();
        const day = today.getDay() || 7; // Get day of week (0-6, 0=Sunday)
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (day - 1)); // Set to Monday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Set to Sunday

        const startDateStr =
          weekStart.getFullYear() +
          "-" +
          String(weekStart.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(weekStart.getDate()).padStart(2, "0");

        const endDateStr =
          weekEnd.getFullYear() +
          "-" +
          String(weekEnd.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(weekEnd.getDate()).padStart(2, "0");

        query.startTime = startDateStr + " 00:00:00";
        query.endTime = endDateStr + " 23:59:59";
      } else if (this.type === "3") {
        // Data for the past 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29); // Set to 30 days ago

        const startDateStr =
          thirtyDaysAgo.getFullYear() +
          "-" +
          String(thirtyDaysAgo.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(thirtyDaysAgo.getDate()).padStart(2, "0");

        const endDateStr =
          today.getFullYear() +
          "-" +
          String(today.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(today.getDate()).padStart(2, "0");

        query.startTime = startDateStr + " 00:00:00";
        query.endTime = endDateStr + " 23:59:59";
      }

      // Jump to alarm record page
      this.$router.push({
        path: "/alarmmanger/record",
        query: query,
      });
    },
    // Initialize echarts method
    initEcharts() {
      // Pie chart color collection
      let pieColors = [
        "#1FC6FFFF",
        "#FF9900FF",
        "#19D2C7FF",
        "#00FFA6FF",
        "#E96E85FF",
        "#9300DDFF",
        "#87A8FFFF",
        "#0067EDFF",
      ];
      // Text color total
      let richColor = {};
      // Loop through colors
      pieColors.forEach((item, i) => {
        richColor[`color${i}`] = {
          fontSize: 12,
          color: item,
        };
      });
      // initializeecharts
      this.eCharts = echarts.init(this.$refs["leftEcharts"]);

      // Add click event listener
      this.eCharts.on("click", (params) => {
        this.handleChartClick(params);
      });

      // Set Options
      this.eCharts.setOption({
        color: pieColors,
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(255,255,255,0.96)",
          borderWidth: 1,
          borderColor: "#e4e7ed",
          textStyle: {
            color: "#303133",
            fontSize: 12,
          },
        },
        legend: {
          top: "bottom",
          textStyle: {
            color: "#606266",
          },
          itemStyle: {
            borderWidth: 1,
          },
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 20,
          padding: [25, 45],
          type: "scroll",
          pageIconColor: "#303133",
          pageIconInactiveColor: "#c0c4cc",
          pageTextStyle: {
            color: "#606266",
          },
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["50%", "43%"],
            itemStyle: {
              borderColor: "#ffffff",
            },
            label: {
              color: "#303133",
              formatter: (params) => {
                return `${params.name}: {color${params.dataIndex}|${
                  params.percent || 0
                }%}`;
              },
              padding: [0, -100, 20, -100],
              rich: richColor,
            },
            labelLine: {
              length2: 100,
            },
            data: this.data,
          },
        ],
      });

      // Listen to window changes Edit size
      window.addEventListener("resize", this.echartsSize);
    },
  },
};
</script>

<style lang="scss" scoped>
.left-container {
  height: 100%;
  .chart-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 8px;
    &__bar {
      width: 3px;
      height: 16px;
      background: #26a69a;
      border-radius: 2px;
      flex-shrink: 0;
    }
    &__name {
      font-size: 15px;
      font-weight: 600;
      color: #1a2a36;
    }
    &__sub {
      font-size: 13px;
      color: #909399;
      font-weight: 400;
    }
  }
  .left-container-echarts {
    height: calc(100% - 44px);
  }
  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    span {
      color: #c0c4cc;
      font-size: 14px;
    }
  }
}
</style>
