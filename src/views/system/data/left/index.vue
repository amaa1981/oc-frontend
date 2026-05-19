<!--
 * @Author: ZWJ
 * @Date: 2024-03-13 17:31:22
 * @LastEditTime: 2025-10-09 11:02:03
 * @LastEditors: FGJ
 * @Description: 左侧 类型分析模块
-->
<template>
  <div class="left-container">
    <!-- 标题 -->
    <div class="chart-header">
      <span class="chart-header__bar" />
      <span class="chart-header__name">{{ title }}</span>
      <span class="chart-header__sub">{{ $t('dataCenter.eventTypeAnalysis') }}</span>
    </div>
    <!-- 表格 -->
    <div class="left-container-echarts" ref="leftEcharts"></div>
    <!-- 无数据 -->
    <div v-show="!Boolean(data.length)" class="empty-state">
      <span>{{ $t('dataCenter.noData') }}</span>
    </div>
  </div>
</template>

<script>
// 标题组件
// echarts
import echarts from "@/plugins/echarts";

export default {
  name: "LeftContainer",
  components: {
  },
  props: {
    // 标题
    title: {
      type: String,
      default: "",
    },
    // 数据
    data: {
      type: Array,
      default: () => [],
    },
    // 报警类型ID映射关系
    alarmTypeMapping: {
      type: Object,
      default: () => ({}),
    },
    // 时间类型 1: 本日 2: 本周 3: 近30天
    type: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      // 初始化echarts
      eCharts: null,
    };
  },
  watch: {
    data: {
      handler(value) {
        // 取消监听
        window.removeEventListener("resize", this.echartsSize);
        // 销毁表格
        this.eCharts?.dispose();
        // 重置为null
        this.eCharts = null;

        // 有数据则初始化内容
        if (value.length !== 0) {
          // 初始化表格
          this.$nextTick(() => {
            this.initEcharts();
          });
        }
      },
      deep: true,
      // immediate: true, // 添加immediate属性，确保组件创建时立即执行一次监听函数
    },
  },
  mounted() {
    // 添加窗口大小变化监听
    window.addEventListener("resize", this.echartsSize);
  },
  beforeDestroy() {
    // 取消监听
    window.removeEventListener("resize", this.echartsSize);
  },
  methods: {
    // echarts修改大小方法
    echartsSize() {
      // 重置echarts大小
      this.eCharts?.resize();
    },
    // 处理图表点击事件
    handleChartClick(params) {
      // 获取点击的数据系列名称
      const seriesName = params.name;

      // 从映射关系中获取对应的报警类型ID
      const eventTypeId = this.alarmTypeMapping[seriesName];

      // 构建跳转参数
      const query = {};
      if (eventTypeId) {
        query.eventTypeId = eventTypeId;
      }

      // 添加时间参数
      if (this.type === "2") {
        // 本周数据
        const today = new Date();
        const day = today.getDay() || 7; // 获取当前是周几（0-6，0代表周日）
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (day - 1)); // 设置到本周一
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // 设置到本周日

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
        // 近30天数据
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29); // 设置到30天前

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

      // 跳转到报警记录页面
      this.$router.push({
        path: "/alarmmanger/record",
        query: query,
      });
    },
    // 初始化echarts方法
    initEcharts() {
      // 饼图颜色合集
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
      // 文本颜色合计
      let richColor = {};
      // 循环添加颜色
      pieColors.forEach((item, i) => {
        richColor[`color${i}`] = {
          fontSize: 12,
          color: item,
        };
      });
      // 初始化echarts
      this.eCharts = echarts.init(this.$refs["leftEcharts"]);

      // 添加点击事件监听
      this.eCharts.on("click", (params) => {
        this.handleChartClick(params);
      });

      // 设置选项
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

      // 监听窗口变化修改大小
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
