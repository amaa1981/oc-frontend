<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2024-01-09 15:18:53
 * @LastEditTime: 2025-07-19 14:00:58
 * @LastEditors: FGJ
 * @Description: 
 * @FilePath: \saas_school_platform\src\views\dataSignage\header\index.vue
-->
<template>
  <div class="container">
    <div class="left">
      <div class="content">
        <!-- <span> {{ weatherInfo.temp }}</span>
        <span>{{ weatherInfo.text }}</span> -->
        <span>{{ getYear }}</span>
        <span>{{ getWeek }}</span>
      </div>
      <div class="time">
        {{ timeInfo.time }}
      </div>
    </div>
    <div class="title">
      <img :src="leftIcon" alt=" " class="icon" />
      <span> {{ $t('dataCenter.dataScreen') }} </span>
      <img :src="rightIcon" alt=" " class="icon" />
    </div>
    <div class="right">
      <!-- <el-button
        v-if="$route.path == '/schoolMainScreen'"
        class="btn"
        @click="changeShow"
        type="primary"
        ><svg-icon :icon-class="!eyeshow ? 'eye-close' : 'eye-open'"></svg-icon
        >{{ $t("dataSignage.disshow") }}</el-button
      > -->
      <el-button class="btn" @click="handleAiReport" type="primary"
        >{{ $t('dataCenter.aiReport') }}</el-button
      >
      <el-button class="btn" @click="toBackPage" type="primary"
        ><i class="el-icon-s-tools"></i> {{ $t('dataCenter.backend') }}</el-button
      >
    </div>
  </div>
</template>
<script>
import leftIcon from "@/assets/images/data/left.png";
import rightIcon from "@/assets/images/data/right.png";

export default {
  name: "Header",
  inject: ["isFull"],
  data() {
    return {
      leftIcon,
      rightIcon,
      timeInfo: {
        year: "",
        week: "",
        time: "",
      },
      timer: null,
    };
  },
  computed: {
    getYear() {
      return this.timeInfo.year;
    },
    getWeek() {
      return this.timeInfo.week;
    },
  },
  created() {
    this.timer = setInterval(() => {
      this.formateDate(new Date());
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    complement(value) {
      return value < 10 ? `0${value}` : `${value}`;
    },
    formateDate(date) {
      const time = new Date(date);
      const year = time.getFullYear();
      const month = this.complement(time.getMonth() + 1);
      const day = this.complement(time.getDate());
      const hour = this.complement(time.getHours());
      const minute = this.complement(time.getMinutes());
      const second = this.complement(time.getSeconds());
      const weekMap = [
        this.$t('dataCenter.sun'),
        this.$t('dataCenter.mon'),
        this.$t('dataCenter.tue'),
        this.$t('dataCenter.wed'),
        this.$t('dataCenter.thu'),
        this.$t('dataCenter.fri'),
        this.$t('dataCenter.sat')
      ];
      const week = weekMap[time.getDay()];
      const timer = `${hour}:${minute}:${second}`;
      const years = `${year}${this.$t('dataCenter.year')} ${month}${this.$t('dataCenter.month')}${day}${this.$t('dataCenter.day')}`;
      if (minute === "00" && second === "00") {
        this.getWeather();
      }
      this.timeInfo.year = years;
      this.timeInfo.week = week;
      this.timeInfo.time = timer;
    },
    requestFullScreen() {
      let de = document.documentElement;
      if (de.requestFullscreen) {
        de.requestFullscreen();
      } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
      } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
      }
    },
    exitFullscreen() {
      let de = document;
      if (de.exitFullscreen) {
        de.exitFullscreen();
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
      }
    },
    toggleFullScreen() {
      if (!this.isFull) {
        this.requestFullScreen();
        this.isFull = true;
      } else {
        this.exitFullscreen();
        this.isFull = false;
      }
    },
    toBackPage() {
      this.$router.push({
        path: "/alarmmanger/record",
      });
    },
    handleAiReport() {
      this.$emit('ai-report');
    },
    getWeather() {
      // 保留原有的天气获取方法占位
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 90px;
  background-image: url(../../../../assets/images/data/top.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 20px 18px;
  position: relative;

  .left {
    flex-grow: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
    top: 10px;

    img {
      height: 42px;
    }

    .content {
      span {
        margin-left: 10px;
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .time {
      margin-left: 12px;
      font-size: 28px;
      font-family: "DS-Digital";
      color: #ffffff;
    }
  }

  .title {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    position: absolute;
    line-height: 80px;

    .icon {
      width: 25px;
      height: 22px;
      margin-bottom: 4px;
    }

    span {
      margin: 0 30px;
      font-size: 42px;
      font-family: "YouSheBiaoTiHei";
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #ffffff;
      filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.16));
      background-image: linear-gradient(180deg, #7ceaffff 40%, #86b3ffff 70%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .right {
    flex-grow: 1;
    position: relative;
    top: 10px;
    display: flex;
    justify-content: flex-end;

    .btn {
      height: 32px;
      background: rgba(255, 255, 255, 0.1) !important;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid rgba(255, 255, 255, 0.6) !important;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      color: #ffffff;
    }

    .svg-icon {
      color: #ffffff;
      margin-right: 6px;
    }
  }
}
</style>
