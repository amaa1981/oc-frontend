<template>
  <div id="app">
    <router-view />
    <theme-picker />
    <!-- 报警弹窗 -->
    <transition name="el-zoom-in-bottom">
      <div class="report" v-if="showmsg" @click="showInfo">
        <div class="cont">
          <img :src="msg.imageUrl" style="object-fit: cover; width:100%; height:120px;" />
          <div>🕐 {{ parseTime(msg.sendTime) }}</div>
          <div>⚠️ {{ msg.violationType }}</div>
          <div>📷 {{ msg.equipmentName }}</div>
          <div>🎯 {{ msg.confidence ? (msg.confidence * 100).toFixed(0) + '%' : '' }}</div>
        </div>
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
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getRecord } from "@/api/system/record";
import store from "@/store";

export default {
  name: "App",
  dicts: ["v1_alarm_type"],
  components: { ThemePicker, AlarmDetail },
  data() {
    return {
      IP: "http://" + window.location.hostname,
      stompClient: null,
      msg: {},
      showmsg: false,
      form: {},
      opens: false,
      strRes: {},
    };
  },
  mounted() {
    this.initStomp();
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
    showInfo() {
      if (this.msg.id) {
        getRecord(this.msg.id).then((response) => {
          this.form = response.data;
          this.opens = true;
          this.showmsg = false;
        }).catch(() => {
          this.form = this.msg;
          this.opens = true;
          this.showmsg = false;
        });
      }
    },
    getList() {
      this.$bus.$emit("refreshAlarmList");
    },
    initStomp() {
      const wsUrl = "http://" + window.location.hostname + ":8081/ws";
      const socket = new SockJS(wsUrl);
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = null;

      this.stompClient.connect(
        {},
        (frame) => {
          console.log("✅ STOMP connected:", frame);
          this.stompClient.subscribe("/topic/alerts", (message) => {
            console.log("🔔 New alert received!");
            this.handleAlert(JSON.parse(message.body));
          });
        },
        (error) => {
          console.log("❌ STOMP error:", error);
          setTimeout(() => this.initStomp(), 5000);
        }
      );
    },
    handleAlert(alert) {
      if (this.$route.path == "/login") return;

      this.msg = {
        id: alert.id,
        imageUrl: alert.imageData ? "data:image/jpeg;base64," + alert.imageData : "",
        sendTime: alert.createTime,
        equipmentName: alert.deviceName || alert.deviceId,
        eventTypeId: alert.violationType,
        violationType: alert.violationType,
        confidence: alert.confidence,
      };

      this.$bus.$emit("newAlert", this.msg);

      this.showmsg = false;
      setTimeout(() => {
        this.showmsg = true;
      }, 500);

      if (alert.coordinate) {
        let position = alert.coordinate.split(",");
        this.$store.dispatch("app/setPosition", {
          lng: parseFloat(position[0]),
          lat: parseFloat(position[1]),
        });
      }
    },
  },
  destroyed() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
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

<style scoped>
.report {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 250px;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #26a69a;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  z-index: 9999;
  padding: 10px;
}
.cont {
  padding: 8px;
}
.cont div {
  margin-top: 4px;
  font-size: 13px;
}
</style>