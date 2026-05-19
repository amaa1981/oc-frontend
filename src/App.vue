<!--
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-05-26 16:40:53
 * @LastEditors: FGJ
 * @LastEditTime: 2025-09-25 10:14:47
-->
<template>
  <div id="app">
    <router-view />
    <theme-picker />
    <!-- <AIChatAssistant /> -->
    <!-- 报警弹窗 -->
    <transition name="el-zoom-in-bottom">
      <div class="report" v-if="showmsg" @click="showInfo">
        <dv-border-box-1 :color="['#26a69a', '#00e5cc']">
          <div class="cont">
            <img :src="msg.imageUrl" style="object-fit: cover" />
            <div>{{ $t("task.time1") }}：{{ parseTime(msg.sendTime) }}</div>
            <div>
              {{ $t("task.alarmType") }}：{{
                $t("dict.v1_alarm_type." + msg.eventTypeId)
              }}
            </div>
            <div>{{ $t("record.equipmentName") }}：{{ msg.equipmentName }}</div>
          </div></dv-border-box-1
        >
      </div>
    </transition>

    <!-- 告警详情组件 -->
    <alarm-detail
      :visible.sync="opens"
      :alarm-data="form"
      @refresh="getList"
      @close="opens = false"
    />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";
import AlarmDetail from "@/components/AlarmDetail";


import { getRecord, updateRecord, delRecord } from "@/api/system/record";
import store from "@/store";
export default {
  name: "App",
  dicts: ["v1_alarm_type"],
  components: { ThemePicker, AlarmDetail
     },
  data() {
    return {
      IP: "http://" + window.location.hostname,
      path:
        process.env.NODE_ENV == "development"
          ? "ws://" + window.location.host + "/webSocket"
          : "ws://" + window.location.hostname + ":9000/webSocket",
      socket: "",
      //报警信息
      msg: {},
      //显示右下角报警信息
      showmsg: false,
      //报警详情
      form: {},
      //报警详情
      opens: false,
      strRes: {},
    };
  },
  mounted() {
    // 初始化
    this.init();
  },
  watch: {
    $route(to, from) {
      if (to.path == "/login") {
        this.showmsg = false;
        this.opens = false;
      }
    },
    opens(newVal) {
      store.dispatch("mqtt/setOpens", newVal);
    },
  },

  methods: {
    //显示报警信息
    showInfo() {
      getRecord(this.msg.id).then((response) => {
        this.form = response.data;
        this.opens = true;
        this.showmsg = false;
      });
    },
    // 刷新列表（空方法，因为App.vue没有列表）
    getList() {
      // 可以在这里触发其他页面的刷新
      this.$bus.$emit("refreshAlarmList");
    },
    // 初始化websocket
    init: function () {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open: function () {
      console.log("报警socket连接成功");
    },
    error: function () {
      console.log("连接错误");
    },
    getMessage: function (msg) {
      console.log("监听到消息");
      // if (this.$route.path == "/login" || this.$route.path == "/camera") {
      //   return;
      // }
      if (this.$route.path == "/login") {
        return;
      }
      this.msg = JSON.parse(msg.data);

      this.showmsg = false;

      setTimeout(() => {
        this.showmsg = true;
      }, 1000);

      //let utterance = new SpeechSynthesisUtterance();
      //utterance.text = "有新的报警";
      //utterance.lang = "zh-CN";
      //utterance.rate = 1.2;
      //utterance.pitch = 1.5;
      //speechSynthesis.speak(utterance);
      //监听位置变化
      if (this.msg.coordinate == "") {
        return;
      }
      let position = this.msg.coordinate.split(",");
      this.$store.dispatch("app/setPosition", {
        lng: parseFloat(position[0]),
        lat: parseFloat(position[1]),
      });
    },
    send: function () {
      this.socket.send(params);
    },
    close: function () {
      console.log("socket已经关闭");
    },
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close;
  },
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${this.$t('appTitle')}`
          : this.$t('appTitle');
      },
    };
  },
};
</script>
<style scoped lang="scss">
#app .theme-picker {
  display: none;
}
</style>
<style lang="scss">
.btns {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  padding-left: 80px;
  justify-content: space-around;
}
.el-input-number--medium {
  width: 100% !important;
}
.cancel {
  text-align: right;
}
.add-edit-dialog {
  display: none;
}
.report {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 999999;
  width: 250px;
  height: 250px;
  color: #e0f7f5;
  background-color: rgba(10, 40, 35, 0.88);
  border-radius: 10px;
  cursor: pointer;
  .cont {
    padding: 20px;
    width: 100%;
    div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #b2dfdb;
      font-size: 13px;
      margin-top: 4px;
      &:first-of-type {
        color: #e0f7f5;
        font-weight: 600;
      }
    }
  }
  img {
    width: 100%;
    height: 150px;
  }
}
.el-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
.anchorBL {
  display: none;
}
</style>
