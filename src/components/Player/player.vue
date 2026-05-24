<!--
 * @Author: LK-5919 1628069508@qq.com
 * @Date: 2023-03-10 22:45:40
 * @LastEditTime: 2025-05-12 14:49:37
 * @LastEditors: FGJ
 * @Description: Single player component - used for popup single view with independent WebSocket connection
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
      // Get edge position timer
      intervalId: null,
      // Distance from browser to left edge of system desktop
      screenX: window.screenX,
      // Distance from browser to left edge of system desktop
      screenY: window.screenY,
      // Whether to minimize the Label page or switch the Label page
      isHiddenTab: false,
      resizeObserver: null,
      position: null,
      playInfo: null,
      // Anti-Shake -- Zoom
      debounceResize: _.debounce(resize, 50),
      // Anti-Shake - Mobile
      debounceMove: _.debounce(move, 50),
      // Anti-shake -- Hide Video
      debounceHidden: _.debounce(hidden, 16),
      // Anti-Shake -- Display Video
      debounceShow: _.debounce(show, 16),
      // Anti-shake -- Create Video
      debounceOpen: _.debounce(open, 16),
      // Anti-shake -- turn off Video
      debounceClose: _.debounce(close, 16),
    };
  },
  created() {
    // Register to listen to ws message receiving events
    window.addEventListener("onWSOpen", this.onWSOpen);
    // Register to listen to ws message receiving events
    window.addEventListener("onMessageWS", this.getSocketData);
    // Register to listen for Label page minimize or switch events
    document.addEventListener("visibilitychange", this.handleVisiable);
    // connection service
    createSocket(window.g.wsBaseURL);
  },
  mounted() {
    let _this = this;
    // Turn on the timer to continuously obtain the position of the browser from the edge of the system desktop
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
    // Monitor the distance from the browser to the left edge of the system desktop
    screenX(newVal) {
      this.handlerScreenMove();
    },
    // Monitor the distance from the browser to the upper edge of the system desktop
    screenY(newVal) {
      this.handlerScreenMove();
    },
  },
  methods: {
    // ws connection success callback
    onWSOpen(e) {
      if (e.detail.isOpen) {
        this.createStream();
      }
    },
    // HideVideo
    handlerHidden() {
      this.debounceHidden({
        videoId: this.config.videoId,
      });
    },
    // Show Video
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
    // screen movement
    handlerScreenMove() {
      this.position = getElementPosition(this.$refs[`player`], this.fullscreen);
      this.debounceMove({
        position: this.position,
        videoId: this.config.videoId,
      });
      //Update the showList location information in the store
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
    // Screen zoom
    handlerScreenResize() {
      this.position = getElementPosition(this.$refs[`player`], this.fullscreen);
      this.debounceResize({
        position: this.position,
        videoId: this.config.videoId,
      });
      // //Update the showList location information in the store
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
    // Connect Video Stream
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
    // DestroyVideo streaming
    destroyStream() {
      this.debounceClose({
        videoId: this.playInfo.videoId,
      });
      this.playInfo = null;
    },
    // Accept WS message callback
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
    // Handle browser Label page switching or browser minimization
    handleVisiable(e) {
      switch (e.target.visibilityState) {
        // Web pages are pre-rendered and the content is invisible
        case "prerender":
          break;
        // The content is invisible, and the background, minimized, and locked screen states are processed.
        case "hidden":
          this.isHiddenTab = true;
          this.handlerHidden();
          break;
        // Normally open
        case "visible":
          this.isHiddenTab = false;
          this.handlerScreenShow();
          break;
      }
    },
    // Assign the latest browser edge distance
    handlerScreeMove() {
      this.screenX = window.screenX;
      this.screenY = window.screenY;
    },
  },
  beforeDestroy() {
    // Send ws message -- close all videos
    this.destroyStream();
    this.resizeObserver.disconnect();
    // clear timer
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
