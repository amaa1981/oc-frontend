<!--
 * @Author: ZWJ
 * @Date: 2024-03-14 16:16:41
 * @LastEditTime: 2025-06-04 14:36:28
 * @LastEditors: FGJ
 * @Description: Bottom top 3 event count module                                                              
-->
<template>
  <div class="bottom-container">
    <!-- 标题 -->
    <div class="chart-header" v-show="name != ''">
      <span class="chart-header__bar" />
      <span class="chart-header__name">{{ name }}</span>
      <span class="chart-header__sub">{{ $t('dataCenter.alarmCountStatistics') }}</span>
    </div>
    <!-- 次数 -->
    <!-- <div class="bottom-numbers" v-if="data && data.length != 0">
      <span :style="{ background: color }"></span>Count
    </div> -->
    <!-- 表格 -->
    <div class="bottom-echarts-box" ref="bottom-echarts"></div>
    <!-- 无数据 -->
    <div v-if="data == undefined || data.length == 0" class="empty-state">
      <span>{{ $t('dataCenter.noData') }}</span>
    </div>
  </div>
</template>

<script>
// echarts
import echarts from "@/plugins/echarts";

export default {
  name: "BottomContainer",
  props: {
    // 颜色
    color: {
      type: String,
      default: "",
    },
    // 楼栋名称
    name: {
      type: String,
      default: "",
    },
    // 类型
    type: {
      type: String,
      default: "",
    },
    // 数据
    data: {
      type: Object,
      default: () => ({}),
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
        // 取消监听
        window.removeEventListener("resize", this.echartsSize);
        // 销毁表格
        this.eCharts?.dispose();
        // 重置为null
        this.eCharts = null;
        // 有数据则初始化内容
        if (value) {
          // 初始化表格
          this.initEcharts();
        }
      },
      deep: true,
    },
    name: {
      handler(value) {
        console.log("底部图片");
        console.log(value);
      },
      deep: true,
    },
  },
  beforeDestroy() {
    // 取消监听
    window.removeEventListener("resize", this.echartsSize);
  },
  methods: {
    daysSinceDate(mmdd) {
      const [monthStr, dayStr] = mmdd.split("-");
      const month = parseInt(monthStr, 10) - 1; // JS months start from 0
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
    // echarts修改大小方法
    echartsSize() {
      // 重置echarts大小
      this.eCharts?.resize();
    },
    // 处理图表点击事件
    handleChartClick(params) {
      // 获取点击的数据系列名称（设备名称）
      const deviceName = this.name;
      const clickDate = params.name;

      // 构建跳转参数
      const query = {
        equipmentName: deviceName, // Add device name param
      };

      // 添加时间参数
      if (this.type === "2") {
        // 本周数据
        const today = new Date();
        const day = today.getDay() || 7; // Get day of week (0-6, 0=Sunday)
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (day - 1)); // Set to Monday
        const targetDate = new Date(weekStart);
        targetDate.setDate(weekStart.getDate() + parseInt(params.dataIndex)); // Based on click index设置目标日期
        const dateStr =
          targetDate.getFullYear() +
          "-" +
          String(targetDate.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(targetDate.getDate()).padStart(2, "0");
        query.startTime = dateStr + " 00:00:00";
        query.endTime = dateStr + " 23:59:59";
      } else if (this.type === "1") {
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
      } else if (this.type === "3") {
        // 近30天数据
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - (29 - params.dataIndex)); // Calculate target date from index
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
      if (this.name == "") {
        return;
      }
      //右边数据
      let week = [];
      let da = [];
      //switchDaysData.key 1: 本日 2: 本周 3: 本月
      // 根据选择的时间类型生成横坐标数据
      if (this.type === "1") {
        // 本日，生成1-23小时
        for (let i = 0; i <= 23; i++) {
          week.push(i);
          da.push(0);
        }
      } else if (this.type === "2") {
        // 本周，生成1-7天
        week = [
          this.$t('dataCenter.monday'),
          this.$t('dataCenter.tuesday'),
          this.$t('dataCenter.wednesday'),
          this.$t('dataCenter.thursday'),
          this.$t('dataCenter.friday'),
          this.$t('dataCenter.saturday'),
          this.$t('dataCenter.sunday'),
        ];
        da = [0, 0, 0, 0, 0, 0, 0];
      } else if (this.type === "3") {
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          week.push(date.getDate());
          da.push(0);
        }
      }
      this.data.forEach((item) => {
        if (this.type == "1") {
          da[item.time] = item.num;
        } else if (this.type == "2") {
          da[item.time - 1] = item.num;
        } else if (this.type == "3") {
          // 计算item.time格式最近第几天
          const index = this.daysSinceDate(item.time);
          da[index] = item.num;
        }
      });
      console.log("底部图片");
      console.log(this.name);
      console.log(week);
      console.log(da);
      // 初始化echarts
      this.eCharts = echarts.init(this.$refs["bottom-echarts"]);

      // 添加点击事件监听
      this.eCharts.on("click", (params) => {
        this.handleChartClick(params);
      });

      // 设置选项
      this.eCharts.setOption({
        color: this.color,
        grid: {
          x: 58,
          y: 32,
          x2: 20,
          y2: 32,
        },
        xAxis: {
          type: "category",
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
            show: false,
          },
        },
        yAxis: {
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
        series: [
          {
            data: da,
            type: "bar",
            barWidth: "20px",
            barGap: 20,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1.3, [
                {
                  offset: 0,
                  color: this.color,
                },
                {
                  offset: 1,
                  color: "transparent",
                },
              ]),
            },
            emphasis: {
              label: {
                show: true,
                position: "top",
                color: "#303133",
              },
            },
          },
        ],
      });

      // 监听窗口变化修改大小
      window.addEventListener("resize", this.echartsSize);
    },
  },
  mounted() {
    // 如果有数据，初始化图表
    if (this.data) {
      this.initEcharts();
    }
  },
};
</script>

<style lang="scss" scoped>
.bottom-container {
  position: relative;
  height: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;

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

  .bottom-echarts-box {
    height: calc(100% - 44px);
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
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
