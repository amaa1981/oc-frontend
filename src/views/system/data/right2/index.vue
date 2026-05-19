<!--
 * @Author: ZWJ
 * @Date: 2024-03-14 11:23:27
 * @LastEditTime: 2025-08-08 09:53:06
 * @LastEditors: FGJ
 * @Description: 右侧 预警趋势模块
-->
<template>
  <div class="right-container">
    <!-- 标题 -->
    <div class="chart-header">
      <span class="chart-header__bar" />
      <span class="chart-header__name">{{ title }}</span>
      <span class="chart-header__sub">{{ $t('dataCenter.peopleVehicleTrend') }}</span>
    </div>
    <!-- 表格 -->
    <div class="right-container-echarts" ref="rightEcharts"></div>
    <!-- 无数据 -->
    <div v-show="!Boolean(data.length)" class="empty-state">
      <span>{{ $t('dataCenter.noData') }}</span>
    </div>
  </div>
</template>

<script>
// echarts
import echarts from "@/plugins/echarts";

export default {
  name: "RightContainer",
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
        console.log("值改变");
        console.log(value);
        // 取消监听
        window.removeEventListener("resize", this.echartsSize);
        // 销毁表格
        this.eCharts?.dispose();
        // 重置为null
        this.eCharts = null;
        // 有数据则初始化内容
        if (value.length != 0) {
          // 初始化表格
          this.initEcharts();
          console.log(value);
        }
      },
      deep: true,
    },
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
      const seriesName = params.seriesName;
      const clickDate = params.name;

      // 从映射关系中获取对应的报警类型ID
      const eventTypeId = this.alarmTypeMapping[seriesName];

      // 构建跳转参数
      const query = {};
      if (eventTypeId) {
        query.eventTypeId = eventTypeId;
      }

      // 添加时间参数
      if (this.data[0].week.length === 7) {
        // 本周数据
        const today = new Date();
        const day = today.getDay() || 7; // 获取当前是周几（0-6，0代表周日）
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (day - 1)); // 设置到本周一
        const targetDate = new Date(weekStart);
        targetDate.setDate(weekStart.getDate() + parseInt(params.dataIndex)); // 根据点击的索引设置目标日期
        const dateStr =
          targetDate.getFullYear() +
          "-" +
          String(targetDate.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(targetDate.getDate()).padStart(2, "0");
        query.startTime = dateStr + " 00:00:00";
        query.endTime = dateStr + " 23:59:59";
      } else if (this.data[0].week.length === 24) {
        // 本日数据
        const today = new Date();
        const dateStr =
          today.getFullYear() +
          "-" +
          String(today.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(today.getDate()).padStart(2, "0");
        query.startTime =
          dateStr + " " + String(clickDate).padStart(2, "0") + ":00:00";
        query.endTime =
          dateStr + " " + String(clickDate).padStart(2, "0") + ":59:59";
      } else {
        // 近30天数据
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - (29 - params.dataIndex)); // 根据点击的索引计算目标日期
        const dateStr =
          targetDate.getFullYear() +
          "-" +
          String(targetDate.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(targetDate.getDate()).padStart(2, "0");
        query.startTime = dateStr + " 00:00:00";
        query.endTime = dateStr + " 23:59:59";
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
        "#EB02FFFF",
        "#FFE500FF",
        "#87A8FFFF ",
        "#E96E85FF",
        "#1FC6FFFF",
        "#FF9900FF",
        "#00FFA6FF",
        "#9300DDFF",
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
      let week = [];
      if (this.data[0].week.length == 7) {
        week = [
          this.$t('dataCenter.monday'),
          this.$t('dataCenter.tuesday'),
          this.$t('dataCenter.wednesday'),
          this.$t('dataCenter.thursday'),
          this.$t('dataCenter.friday'),
          this.$t('dataCenter.saturday'),
          this.$t('dataCenter.sunday'),
        ];
      } else {
        week = this.data[0].week;
      }

      let series = [];
      this.data.forEach((item) => {
        series.push({
          name: item.date_type,
          type: "line",
          smooth: true,
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: "series",
          },
          data: item.count,
        });
      });

      // 初始化echarts
      this.eCharts = echarts.init(this.$refs["rightEcharts"]);

      // 添加点击事件监听
      this.eCharts.on("click", (params) => {
        this.handleChartClick(params);
      });

      // 设置选项
      this.eCharts.setOption({
        color: pieColors,
        tooltip: {
          trigger: "axis",
          icon: "",
          backgroundColor: "rgba(255,255,255,0.96)",
          borderWidth: 1,
          borderColor: "#e4e7ed",
          textStyle: {
            color: "#303133",
            fontSize: 12,
          },
          axisPointer: {
            type: "line",
            lineStyle: {
              type: "solid",
              color: "#c0c4cc",
              opacity: 0.6,
            },
            label: {
              backgroundColor: "#e4e7ed",
            },
          },
          formatter(params) {
            let dataStr = `<div style="margin-bottom:4px;font-size:14px;color:#303133">${params[0].name}</div>`;
            params.forEach((item) => {
              dataStr += `
            <div style="height:20px;margin:3px 0 7px 0;display: flex;align-items: center;justify-content: space-between;">
               <div style="display:flex;align-items: center;">
                <span style="display:inline-block;margin-right:5px;width:12px;height:5px;background-color:${item.color};"></span>
                <span style="color:#606266">${item.seriesName}</span>
                </div>
                <span style="font-weight:bold;margin-left:30px;font-size:14px;color:#303133">${item.data}</span>
            </div>`;
            });
            return dataStr;
          },
        },
        legend: {
          top: "7%",
          textStyle: {
            color: "#606266",
          },
          itemStyle: {
            borderWidth: 0,
          },
          itemWidth: 12,
          itemHeight: 5,
          itemGap: 50,
          icon: "rect",
          type: "scroll",
          pageIconColor: "#303133",
          pageIconInactiveColor: "#c0c4cc",
          pageTextStyle: {
            color: "#606266",
          },
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "7%",
          top: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: week,
            axisLine: {
              lineStyle: {
                color: "#dcdfe6",
                type: "solid",
              },
            },
            axisLabel: {
              color: "#909399",
            },
            axisTick: {
              inside: true,
            },
          },
        ],
        yAxis: [
          {
            name: this.$t('dataCenter.peopleCount2'),
            nameTextStyle: {
              padding: [0, 40, 10, 0],
              color: "#909399",
            },
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#dcdfe6",
              },
            },
            axisLabel: {
              color: "#909399",
            },
            splitLine: {
              lineStyle: {
                color: "#ebeef5",
                type: "dashed",
              },
            },
          },
        ],
        series: series,
      });

      // 监听窗口变化修改大小
      window.addEventListener("resize", this.echartsSize);
    },
  },
};
</script>

<style lang="scss" scoped>
.right-container {
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
  .right-container-echarts {
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
