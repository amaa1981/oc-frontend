<!--
 * @Author: LK-5919 1628069508@qq.com
 * @Date: 2023-03-10 22:45:40
 * @LastEditTime: 2025-05-12 14:50:07
 * @LastEditors: FGJ
 * @Description: Player component - used for multi-screen, parent handles show/hide/move callbacks
 * @FilePath: \ruoyi-ui\src\components\Player\index.vue
-->
<template>
  <div class="container">
    <div
      :id="'video' + config.id"
      :ref="'player' + config.id"
      class="video"
      :class="config.type === 'show' ? 'video-show' : ''"
    >
      <p v-if="config.type === 'show'">{{ $t("monitor.playing") }}</p>
      <div v-else class="no-sign">
        <img src="../../assets/images/monitor/nosign-icon.png" />
        <span>{{ $t("monitor.nosign") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getElementPosition } from "../../utils/screenInfo.js";
import {
  open,
  resize,
  move,
  close,
  show,
  hidden,
} from "../../utils/wsMessage.js";
import ResizeObserver from "resize-observer-polyfill";
import _ from "lodash";
import store from "@/store";
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
    let _this = this;
    // 挂载全局事件
    this.$bus.$on("move", () => {
      this.$nextTick(() => {
        _this.handlerScreenMove();
      });
    });
  },
  mounted() {
    let _this = this;
    this.resizeObserver = new ResizeObserver((entries) => {
      if (_this.config.rtspUrl !== "") {
        _this.$nextTick(() => {
          console.log("resize");
          _this.handlerScreenResize();
        });
      }
    });
    this.resizeObserver.observe(this.$refs[`player${this.config.id}`]);
    console.log("store.state.mqtt.connected");
    console.log(store.state.mqtt.connected);
  },
  computed: {},
  watch: {
    "config.type": {
      handler(newVal, oldVal) {
        if (newVal === "open" && oldVal === "show") {
          // 此情景为此分屏正在播放视频，但需切换新的视频
          this.destroyStream();
          this.createStream();
        } else if (newVal === "open") {
          // 此情景为此分屏第一次创建视频
          this.createStream();
        } else if (newVal === "show" && oldVal === "hidden") {
          // 此情景为标签页切回或关闭浏览器最小化后显示视频
          this.$nextTick(() => {
            this.handlerScreenShow();
          });
        } else if (newVal === "hidden" && oldVal === "show") {
          // 此情景为标签页切走或浏览器最小化后隐藏视频
          this.handlerHidden();
        } else if (newVal === "show") {
          // 此情景展示之前切换到更少分屏时被隐藏的视频
          this.$nextTick(() => {
            this.handlerScreenShow();
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 隐藏视频
    handlerHidden() {
      this.debounceHidden({
        videoId: this.config.videoId,
      });
    },
    // 显示视频
    handlerScreenShow() {
      this.position = getElementPosition(
        this.$refs[`player${this.config.id}`],
        this.fullscreen
      );
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
      if (this.config.type !== "show") return;
      this.position = getElementPosition(
        this.$refs[`player${this.config.id}`],
        this.fullscreen
      );
      this.debounceMove({
        position: this.position,
        videoId: this.config.videoId,
      });
    },
    // 画面缩放
    handlerScreenResize() {
      if (this.config.type !== "show") return;
      this.position = getElementPosition(
        this.$refs[`player${this.config.id}`],
        this.fullscreen
      );
      this.debounceResize({
        position: this.position,
        videoId: this.config.videoId,
      });
      store.dispatch(
        "mqtt/setShowList",
        store.state.mqtt.showList.map((item) => {
          if (item.videoId === this.config.videoId) {
            item.position = this.position;
          }
          return item;
        })
      );
    },
    // 连接视频流
    createStream() {
      this.position = getElementPosition(
        this.$refs[`player${this.config.id}`],
        this.fullscreen
      );
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
  },
  beforeDestroy() {
    this.resizeObserver.disconnect();
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
    background-color: #1a3a4a;
    box-sizing: content-box;
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 6px;

    p {
      text-align: center;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    .no-sign {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        width: 48px;
        height: 48px;
        opacity: 0.5;
      }

      span {
        text-align: center;
        font-size: 13px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 8px;
      }
    }
  }

  .video-show {
    // background-color: transparent;
  }
}
</style>
