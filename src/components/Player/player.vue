<!--
 * @Author: LK-5919 1628069508@qq.com
 * @Date: 2023-03-10 22:45:40
 * @LastEditTime: 2025-05-12 14:49:37
 * @LastEditors: FGJ
 * @Description: 单播放器组件 --- 用于弹窗单画面使用，此组件单独建立websocket连接，画面的显示，隐藏，缩放，移动，创建，销毁均由此组件独立控制
 * @FilePath: \ruoyi-ui\src\components\Player\player.vue
-->
<template>
  <div class="container">
    <div ref="player" id="video" class="video"></div>
  </div>
</template>

<script>
import { getElementPosition } from "../../utils/screenInfo.js";
import store from "@/store";
import {
  open,
  resize,
  move,
  close,
  show,
  hidden,
} from "../../utils/wsMessage.js";
import { createSocket, closeWebsocket } from "../../utils/websocket.js";
import ResizeObserver from "resize-observer-polyfill";
import _ from "lodash";
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
    fullscreen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      // 获取边缘位置的定时器
      intervalId: null,
      // 浏览器到系统桌面左边缘距离
      screenX: window.screenX,
      // 浏览器到系统桌面左边缘距离
      screenY: window.screenY,
      // 是否标签页最小化或切换标签页
      isHiddenTab: false,
      resizeObserver: null,
      position: null,
      playInfo: null,
      // 防抖 -- 缩放
      debounceResize: _.debounce(resize, 50),
      // 防抖 -- 移动
      debounceMove: _.debounce(move, 50),
      // 防抖 -- 隐藏视频
      debounceHidden: _.debounce(hidden, 16),
      // 防抖 -- 显示视频
      debounceShow: _.debounce(show, 16),
      // 防抖 -- 创建视频
      debounceOpen: _.debounce(open, 16),
      // 防抖 -- 关闭视频
      debounceClose: _.debounce(close, 16),
    };
  },
  created() {
    // 注册监听ws消息接收事件
    window.addEventListener("onWSOpen", this.onWSOpen);
    // 注册监听ws消息接收事件
    window.addEventListener("onMessageWS", this.getSocketData);
    // 注册监听标签页最小化或切换事件
    document.addEventListener("visibilitychange", this.handleVisiable);
    // 连接服务
    createSocket(window.g.wsBaseURL);
  },
  mounted() {
    let _this = this;
    // 开启定时器不断获取浏览器距离系统桌面边缘的位置
    this.intervalId = setInterval(() => {
      _this.handlerScreeMove();
    }, 80);
    this.resizeObserver = new ResizeObserver((entries) => {
      if (_this.config.rtspUrl !== "") {
        _this.$nextTick(() => {
          _this.handlerScreenResize();
        });
      }
    });
    this.resizeObserver.observe(this.$refs[`player`]);
  },
  computed: {},
  watch: {
    // 监听浏览器到系统桌面左边缘的距离
    screenX(newVal) {
      this.handlerScreenMove();
    },
    // 监听浏览器到系统桌面上边缘的距离
    screenY(newVal) {
      this.handlerScreenMove();
    },
  },
  methods: {
    // ws连接成功回调
    onWSOpen(e) {
      if (e.detail.isOpen) {
        this.createStream();
      }
    },
    // 隐藏视频
    handlerHidden() {
      this.debounceHidden({
        videoId: this.config.videoId,
      });
    },
    // 显示视频
    handlerScreenShow() {
      this.position = getElementPosition(this.$refs[`player`], this.fullscreen);
      this.debounceShow({
        position: this.position,
        videoId: this.config.videoId,
      });
      this.playInfo = {
        videoId: this.config.videoId,
        rtspUrl: this.config.rtspUrl,
      };
    },
    // 画面移动
    handlerScreenMove() {
      this.position = getElementPosition(this.$refs[`player`], this.fullscreen);
      this.debounceMove({
        position: this.position,
        videoId: this.config.videoId,
      });
      //更新store中的showList位置信息
      // store.dispatch(
      //   "mqtt/setShowList",
      //   store.state.mqtt.showList.map((item) => {
      //     if (item.videoId === this.config.videoId) {
      //       item.position = this.position;
      //     }
      //     return item;
      //   })
      // );
    },
    // 画面缩放
    handlerScreenResize() {
      this.position = getElementPosition(this.$refs[`player`], this.fullscreen);
      this.debounceResize({
        position: this.position,
        videoId: this.config.videoId,
      });
      // //更新store中的showList位置信息
      // store.dispatch(
      //   "mqtt/setShowList",
      //   store.state.mqtt.showList.map((item) => {
      //     if (item.videoId === this.config.videoId) {
      //       item.position = this.position;
      //     }
      //     return item;
      //   })
      // );
    },
    // 连接视频流
    createStream() {
      this.position = getElementPosition(this.$refs[`player`], this.fullscreen);
      this.debounceOpen({
        position: this.position,
        videoId: this.config.videoId,
        url: this.config.rtspUrl,
        params: {
          fullscreen: false,
          volume: 0,
          autoplay: true,
        },
      });
      this.playInfo = {
        videoId: this.config.videoId,
        rtspUrl: this.config.rtspUrl,
      };
    },
    // 销毁视频流
    destroyStream() {
      this.debounceClose({
        videoId: this.playInfo.videoId,
      });
      this.playInfo = null;
    },
    // 接受WS消息回调
    getSocketData(res) {
      const data = res && res.detail.data;
      try {
        let res = JSON.parse(data);
        if (res.code === 200) {
          switch (res.type) {
            case "open":
              break;
            case "close":
              closeWebsocket();
              window.removeEventListener("onMessageWS", this.getSocketData);
              window.removeEventListener("onWSOpen", this.onWSOpen);
              document.removeEventListener(
                "visibilitychange",
                this.handleVisiable
              );
              break;
            case "click":
              break;
            default:
              break;
          }
        }
      } catch (error) {}
    },
    // 处理浏览器标签页切换或浏览器最小化
    handleVisiable(e) {
      switch (e.target.visibilityState) {
        // 网页预渲染，内容不可见
        case "prerender":
          break;
        // 内容不可见，处理后台、最小化、锁屏状态
        case "hidden":
          this.isHiddenTab = true;
          this.handlerHidden();
          break;
        // 处于正常打开
        case "visible":
          this.isHiddenTab = false;
          this.handlerScreenShow();
          break;
      }
    },
    // 赋值最新的浏览器边缘距离
    handlerScreeMove() {
      this.screenX = window.screenX;
      this.screenY = window.screenY;
    },
  },
  beforeDestroy() {
    // 发送ws消息 -- 关闭全部视频
    this.destroyStream();
    this.resizeObserver.disconnect();
    // 清除定时器
    clearInterval(this.intervalId);
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;

  .video {
    // background-color: black;
    box-sizing: content-box;
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
  }
}
</style>
