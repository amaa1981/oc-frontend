<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-03-10 09:27:47
 * @LastEditTime: 2025-08-01 15:33:55
 * @LastEditors: FGJ
 * @Description: Player screen component
 * @FilePath: \ruoyi-ui\src\components\playerScreen\index.vue
-->
<template>
  <div
    class="container-player"
    v-loading="loading"
    :element-loading-text="$t('monitor.loadingText')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <!-- <div class="btnList">
      <el-button-group>
        <el-button :type="playerLength === btn.num ? 'primary' : ''" v-for="btn in playerBtnDate" :key="btn.num"
          @click="setPlayerLength(btn.num)" :disabled="btn.num === playerLength">{{ btn.name }}</el-button>
        <el-button icon="el-icon-rank" title="Full Screen" @click.prevent="toggleFullscreen"></el-button>
      </el-button-group>
    </div> -->
    <div class="btnList">
      <div class="btn-left">
        <span class="layout-label">{{ $t("monitor.layout") }}:</span>
        <el-button
          class="btn-item"
          @click="setPlayerLength(btn.num)"
          :disabled="btn.num === playerLength"
          v-for="btn in playerBtnDate"
          :key="btn.num"
          :class="playerLength === btn.num ? 'btn-active' : ''"
        >
          <i :class="btn.icon"></i>
          <span>{{ btn.num }}</span>
        </el-button>
      </div>
      <div class="btn-right">
        <el-button class="btn-item" @click="saveCurrentConfig">
          <i class="el-icon-document-checked"></i>
          <span>{{ $t("monitor.save") }}</span>
        </el-button>
        <el-button class="btn-item" @click.prevent="toggleFullscreen">
          <i class="el-icon-full-screen"></i>
          <span>{{ $t("monitor.fullscreen") }}</span>
        </el-button>
      </div>
    </div>
    <fullscreen :fullscreen.sync="fullscreen" class="fullscreen">
      <div
        class="videoList"
        :class="[fullscreen ? 'isFullscreen' : 'notFullscreen']"
      >
        <div
          v-for="(player, index) in players"
          :key="index"
          class="video-item"
          :class="{
            oneVideo: players.length === 1,
            isFullscreen: fullscreen,
            fourVideo: players.length === 4,
            sixVideo: players.length === 6,
            active: index === playerIdx && !fullscreen && players.length > 1,
          }"
          @click.prevent="changePlayScreen(index)"
        >
          <Player
            class="player"
            :config="player"
            :fullscreen="fullscreen"
          ></Player>
        </div>
      </div>
    </fullscreen>
  </div>
</template>

<script>
import _ from "lodash";
import { createSocket, closeWebsocket } from "../../utils/websocket.js";
import Player from "../Player/index.vue";
import { hidden, closeAll, show } from "../../utils/wsMessage.js";
import store from "@/store";
import internetAvailable from "internet-available";
export default {
  data() {
    return {
      loading: true,
      // 确保每次打开页面只提示一次下载插件的弹窗
      isDownload: true,
      // 获取边缘位置的定时器
      intervalId: null,
      // 浏览器到系统桌面左边缘距离
      screenX: window.screenX,
      // 浏览器到系统桌面左边缘距离
      screenY: window.screenY,
      // 是否全屏
      fullscreen: false,
      // 是否标签页最小化或切换标签页
      isHiddenTab: false,
      // 分屏按钮配置
      playerBtnDate: [
        {
          num: 1,
          name: this.$t("monitor.one"),
          icon: 'el-icon-monitor'
        },
        {
          num: 4,
          name: this.$t("monitor.four"),
          icon: 'el-icon-s-grid'
        },
        {
          num: 6,
          name: this.$t("monitor.six"),
          icon: 'el-icon-s-grid'
        }
      ],
      // 当前分屏数量 -- 默认为4
      playerLength: 0,
      // 当前高亮的分屏下标
      playerIdx: 0,
      // 当前分屏的播放列表
      players: [],
      // 被隐藏的播放列表
      oldPlayers: [],
      // 记录当前的播放的map映射
      isPlayingList: new Map(),
    };
  },
  components: {
    Player,
  },
  created() {
    // 连接服务
    createSocket(window.g.wsBaseURL);
    // 设置初始分屏数量为4
    this.setPlayerLength(4);
    // 配置恢复将在WebSocket连接成功后执行
    // store.state.mqtt.showList 填充到players
    // this.players = store.state.mqtt.showList;
    // // 将store.state.mqtt.showList 填充到isPlayingList
    // for (let item of this.players) {
    //   this.isPlayingList.set(item.videoId, {
    //     rtspUrl: item.rtspUrl,
    //     index: item.index,
    //   });
    // }
  },
  mounted() {
    let _this = this;
    // 开启定时器不断获取浏览器距离系统桌面边缘的位置
    this.intervalId = setInterval(() => {
      _this.handlerScreeMove();
    }, 80);
    // 注册ws连接监听回调
    window.addEventListener("onWSOpen", this.handlerOpenWS);
    // 注册监听ws消息接收事件
    window.addEventListener("onMessageWS", this.getSocketData);
    // 注册监听标签页最小化或切换事件
    document.addEventListener("visibilitychange", this.handleVisiable);
    // 注册监听窗口刷新或者关闭事件
    window.addEventListener("beforeunload", this.handlerDestory);
    // 监听页面滚动，通知插件跟随移动
    this._onScroll = () => { this.$bus.$emit("move") }
    window.addEventListener("scroll", this._onScroll, true)
    // 挂载$bus -- 播放事件
    this.$bus.$on("sendOpenInfo", (infoObj) => {
      // 执行播放事件，支持静默模式（恢复配置时不显示重复播放提示）
      this.play(infoObj, infoObj.silent || false);
    });
  },
  computed: {},
  watch: {
    // 监听store中的opens状态
    "$store.state.mqtt.opens": {
      handler(newVal) {
        console.log("mqtt.opens状态变更为:", newVal);
        // 这里可以根据需要添加当opens状态变化时的处理逻辑
        if (newVal) {
          this.hideAll();
        } else {
          this.showAll();
        }
      },
      deep: true,
    },
    // 监听浏览器到系统桌面左边缘的距离
    screenX(newVal) {
      if (!this.isHiddenTab) {
        this.$bus.$emit("move");
      }
    },
    // 监听浏览器到系统桌面上边缘的距离
    screenY(newVal) {
      if (!this.isHiddenTab) {
        this.$bus.$emit("move");
      }
    },
    // 监听当前分屏数量
    playerLength(newVal, oldVal) {
      // 切换到更多分屏数量，不改变当前的播放窗口，新增分屏数量
      if (newVal > oldVal) {
        for (let index = oldVal; index < newVal; index++) {
          this.setVideoToScreen(index);
        }
      } else {
        // 切换到更少分屏
        // 先将当前分屏中正在播放的视频隐藏
        for (let item of this.players) {
          if (item.type === "show") {
            item.type = "hidden";
            hidden({
              videoId: item.videoId,
            });
            this.oldPlayers.push(item);
          }
        }
        for (let index = 0; index < newVal; index++) {
          this.setVideoToScreen(index);
        }
        // 移除多余分屏
        this.players.splice(newVal, oldVal - newVal);
      }
    },
  },
  methods: {
    hideAll() {
      console.log("hideAll");
      console.log(this.players);
      store.state.mqtt.showList.forEach((item) => {
        if (item.videoId != "") {
          hidden({
            videoId: item.videoId,
          });
        }
      });
    },
    showAll() {
      console.log("showAll");
      store.state.mqtt.showList.forEach((item) => {
        if (item.videoId != "") {
          show(item);
        }
      });
    },
    // 处理页面刷新或关闭，或销毁当前实例
    handlerDestory() {
      // 发送ws消息 -- 关闭全部视频
      closeAll({
        type: "closeAll",
      });
      // 断开webSocket连接
      closeWebsocket();
      // 清除定时器
      clearInterval(this.intervalId);
      // 清除map
      this.isPlayingList.clear();
      // 清除store.state.mqtt.showList
      store.dispatch("mqtt/setShowList", []);
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
          for (const item of this.players) {
            if (item.type === "show") {
              item.type = "hidden";
            }
          }
          break;
        // 处于正常打开
        case "visible":
          this.isHiddenTab = false;
          // 延迟恢复显示，确保页面渲染完成
          this.$nextTick(() => {
            setTimeout(() => {
              for (const item of this.players) {
                if (item.type === "hidden" && item.videoId) {
                  item.type = "show";
                }
              }
            }, 100);
          });
          break;
      }
    },
    // 建立websocket连接
    handlerOpenWS(res) {
      const isOpen = res && res.detail.isOpen;
      this.loading = false;
      if (!isOpen && this.isDownload) {
        this.isDownload = false;
        let that = this;
        this.$confirm(that.$t("monitor.downloadTips"), that.$t("monitor.tip"), {
          confirmButtonText: that.$t("monitor.downloadPlugin"),
          cancelButtonText: that.$t("monitor.close"),
          type: "warning",
        })
          .then(async () => {
            // 检测网络连接状态
            try {
              await internetAvailable({
                timeout: 3000,
                retries: 2,
              });
              // 有网络，使用云端下载
              window.location =
                "https://web-1318283609.cos.ap-guangzhou.myqcloud.com/tool/ChromePlayer_x64.exe";
            } catch (error) {
              // 无网络，使用本地路径
              console.log("网络不可用，使用本地安装包");
              window.location = "/ChromePlayer_x64.exe";
            }
          })
          .catch(() => {});
      } else if (isOpen) {
        console.log("WebSocket连接成功，准备恢复配置");
        // WebSocket连接成功后再恢复配置，延迟确保设备列表组件也已加载完成
     
          this.restoreConfig();
     
      }
    },
    // 赋值最新的浏览器边缘距离
    handlerScreeMove() {
      this.screenX = window.screenX;
      this.screenY = window.screenY;
    },
    // 接受WS消息回调
    getSocketData(res) {
      const data = res && res.detail.data;
      try {
        let res = JSON.parse(data);
        if (res.code !== 200) {
          // this.$message({
          //   message: this.$t("monitor.fail"),
          //   type: "warning",
          // });
          console.debug("操作失败");
        } else {
          switch (res.type) {
            case "open":
              let idx = 0;
              // 通知列表组件
              this.$bus.$emit("addVideoId", {
                videoId: res.videoId,
              });
              for (let item of this.players) {
                if (item.type === "open" && item.videoId === res.videoId) {
                  item.type = "show";
                  this.isPlayingList.set(item.videoId, {
                    rtspUrl: item.rtspUrl,
                    index: idx,
                  });
                  this.playerIdx === this.playerLength - 1
                    ? (this.playerIdx = 0)
                    : this.playerIdx++;
                  return;
                }
                idx++;
              }
              break;
            case "close":
              // 在已播放列表中移除对应信息
              if (
                this.players[this.isPlayingList.get(res.videoId).index].type !==
                "open"
              ) {
                // 说明此时此窗口未正在播放其他通道
                this.setPlayerData(this.isPlayingList.get(res.videoId).index);
              }
              this.isPlayingList.delete(res.videoId);
              // 通知列表组件
              this.$bus.$emit("removeVideoId", {
                videoId: res.videoId,
              });
              break;
            case "click":
              this.playerIdx = this.isPlayingList.get(res.videoId).index;
              break;
            default:
              break;
          }
        }
      } catch (error) {}
    },
    // 设置players的动态数据
    setPlayerData(index, rtspUrl = "", label = "", type = "", videoId = "") {
      this.$set(this.players, index, {
        rtspUrl,
        id: index, // video element ID - plugin checks for elements with class starting with "video"
        label,
        type,
        videoId, // Unique monitor ID
      });
    },
    // 将隐藏的视频重新赋值到新的分屏上
    setVideoToScreen(index) {
      if (this.oldPlayers[0] !== undefined) {
        let data = this.oldPlayers.shift();
        this.isPlayingList.set(data.videoId, {
          rtspUrl: data.rtspUrl,
          index: index,
        });
        this.setPlayerData(
          index,
          data.rtspUrl,
          data.label,
          "show",
          data.videoId
        );
      } else {
        this.setPlayerData(index);
      }
    },
    // 设置播放屏幕数量
    setPlayerLength(num) {
      if (num === this.players.length) return;
      this.playerIdx = 0;
      this.playerLength = num;
    },
    // 切换全屏
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
    // 切换播放屏幕
    changePlayScreen(index) {
      this.playerIdx = index;
    },
    // 播放事件
    play(obj, silent = false) {
      if (this.isPlayingList.has(obj.videoId)) {
        // silent 为 true 时不显示提示（用于恢复配置）
        if (!silent) {
          this.$message({
            message: this.$t("monitor.playTip"),
            type: "warning",
          });
        }
        return;
      } else {
        this.setPlayerData(
          this.playerIdx,
          obj.rtspUrl,
          obj.label,
          "open",
          obj.videoId
        );
      }
    },
    // 保存当前配置到localStorage
    saveCurrentConfig() {
      try {
        // 收集正在播放的设备及其位置信息
        const playingDevices = this.players
          .filter((player) => player.type === "show" || player.type === "open")
          .map((player) => ({
            rtspUrl: player.rtspUrl,
            label: player.label,
            videoId: player.videoId,
            screenIndex: player.id, // Screen position index (0,1,2,3,4,5)
          }));

        const config = {
          playerLength: this.playerLength, // Split screen count (1,4,6)
          players: playingDevices,
          savedAt: new Date().toISOString(), // Save time (human readable)
          timestamp: Date.now(), // Timestamp
        };

        localStorage.setItem("monitor_config", JSON.stringify(config));

        this.$message({
          message: this.$t("monitor.saveSuccess") || "Settings saved successfully",
          type: "success",
        });

        console.log("已保存监控配置:");
        console.log(`- 分屏数量: ${config.playerLength}`);
        console.log(`- playing device数量: ${playingDevices.length}`);
        playingDevices.forEach((device) => {
          console.log(
            `  · device ${device.videoId} (${device.label}) at position ${device.screenIndex}`
          );
        });
        console.log(`- 保存时间: ${config.savedAt}`);
      } catch (error) {
        console.error("保存配置失败:", error);
        this.$message({
          message: this.$t("monitor.saveFailed") || "Failed to save settings",
          type: "error",
        });
      }
    },
    // 从localStorage恢复配置
    restoreConfig() {
      try {
        const savedConfig = localStorage.getItem("monitor_config");
        if (savedConfig) {
          const config = JSON.parse(savedConfig);

          console.log("开始恢复监控配置:");
          console.log(`- 保存时间: ${config.savedAt || "未知"}`);
          console.log(`- 分屏数量: ${config.playerLength}`);
          console.log(
            `- saved device count: ${config.players ? config.players.length : 0}`
          );

          // 恢复画面数量
          if (config.playerLength && [1, 4, 6].includes(config.playerLength)) {
            console.log(`恢复分屏数量: ${config.playerLength}`);
            this.setPlayerLength(config.playerLength);
          } else {
            console.warn(`无效的分屏数量: ${config.playerLength}，使用默认值4`);
            this.setPlayerLength(4);
          }

          // 延迟恢复playing device，确保分屏已经设置完成
          setTimeout(() => {
            if (config.players && config.players.length > 0) {
              // 用于跟踪已占用的屏幕位置
              const occupiedPositions = new Set();

              // 按原始播放位置restoring device
              config.players.forEach((savedPlayer, configIndex) => {
                // 使用保存的屏幕位置索引
                const targetScreenIndex = savedPlayer.screenIndex;

                // 检查目标位置是否有效且未被占用
                if (
                  targetScreenIndex >= 0 &&
                  targetScreenIndex < this.playerLength &&
                  savedPlayer.videoId &&
                  !occupiedPositions.has(targetScreenIndex)
                ) {
                  // 标记位置已占用
                  occupiedPositions.add(targetScreenIndex);

                  // 恢复playing device信息到指定位置
                  this.setPlayerData(
                    targetScreenIndex,
                    savedPlayer.rtspUrl,
                    savedPlayer.label,
                    "open",
                    savedPlayer.videoId
                  );

                  // 添加到正在播放列表，使用正确的屏幕索引
                  this.isPlayingList.set(savedPlayer.videoId, {
                    rtspUrl: savedPlayer.rtspUrl,
                    index: targetScreenIndex,
                  });

                  console.log(
                    `✓ restoring device ${savedPlayer.videoId} (${savedPlayer.label}) to original screen position ${targetScreenIndex}`
                  );

                  // 延迟触发播放事件，WebSocket 响应时会自动通知设备列表更新状态
                  setTimeout(() => {
                    console.log(
                      `▶ starting at position ${targetScreenIndex} playing device ${savedPlayer.videoId}`
                    );
                    this.$bus.$emit("sendOpenInfo", {
                      videoId: savedPlayer.videoId,
                      label: savedPlayer.label,
                      rtspUrl: savedPlayer.rtspUrl,
                      silent: true, // No duplicate play hint when restoring
                    });
                  }, 200 + configIndex * 100); // 100ms interval per device
                } else {
                  // 处理位置无效或冲突的情况
                  let reason = "";
                  if (
                    targetScreenIndex < 0 ||
                    targetScreenIndex >= this.playerLength
                  ) {
                    reason = `position ${targetScreenIndex} exceeds current split screen range [0-${
                      this.playerLength - 1
                    }]`;
                  } else if (occupiedPositions.has(targetScreenIndex)) {
                    reason = `position ${targetScreenIndex} already occupied by another device`;
                  } else if (!savedPlayer.videoId) {
                    reason = "device ID is empty";
                  }

                  console.warn(
                    `✗ skipping device ${savedPlayer.videoId} (${savedPlayer.label}): ${reason}`
                  );
                }
              });

              // 统计恢复结果
              const totalDevices = config.players.length;
              const restoredDevices = occupiedPositions.size;
              const skippedDevices = totalDevices - restoredDevices;

              console.log(
                "=================== Configuration restore complete ==================="
              );
              console.log(`📊 恢复统计:`);
              console.log(`  - 总设备数: ${totalDevices}`);
              console.log(`  - 成功恢复: ${restoredDevices}`);
              console.log(`  - skipping device: ${skippedDevices}`);
              console.log(
                `📍 occupied positions: [${Array.from(occupiedPositions)
                  .sort((a, b) => a - b)
                  .join(", ")}]`
              );
              console.log("================================================");
            }
          }, 500); // Delay to ensure WebSocket stable and device list loaded
        }
      } catch (error) {
        console.error("恢复配置失败:", error);
      }
    },
  },
  beforeDestroy() {
    console.log("beforeDestroy");
    console.log("销毁");
    //卸载事件监听
    window.removeEventListener("onMessageWS", this.getSocketData);
    window.removeEventListener("onWSOpen", this.handlerOpenWS);
    document.removeEventListener("visibilitychange", this.handleVisiable);
    window.removeEventListener("beforeunload", this.handlerDestory);
    window.removeEventListener("scroll", this._onScroll, true)
    this.handlerDestory();
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.container-player {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .btnList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid #ebeef5;
    flex-shrink: 0;

    .btn-left,
    .btn-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .layout-label {
      font-size: 14px;
      font-weight: 500;
      color: #606266;
      margin-right: 4px;
      white-space: nowrap;
    }

    .btn-item {
      cursor: pointer;
      text-align: center;
      white-space: nowrap;
      font-size: 14px;
      border: 1px solid #dcdfe6;
      padding: 6px 14px;
      background: #fff;
      background-image: none;
      color: #606266;
      border-radius: 6px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 4px;

      i {
        font-size: 15px;
      }

      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background: #ecf5ff;
      }
    }

    .btn-active {
      background: #234b5a;
      background-image: none;
      color: #fff;
      border-color: #234b5a;

      &:hover {
        background: #2a5a6b;
        border-color: #2a5a6b;
        color: #fff;
      }
    }
  }

  // vue-fullscreen 组件渲染的包裹层
  .fullscreen {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  // vue-fullscreen 内部可能生成额外 div，用 ::v-deep 穿透
  ::v-deep .fullscreen-wrapper {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .videoList {
    display: flex;
    box-sizing: border-box;
    flex-wrap: wrap;
    gap: 8px;
    align-content: flex-start;

    &.isFullscreen {
      width: 100vw;
      height: 100vh;
      padding: 0;
    }

    &.notFullscreen {
      flex: 1;
      min-height: 0;
      padding: 12px;
    }

    .oneVideo {
      width: 100%;
      height: 100%;
    }

    .oneVideo.isFullscreen {
      height: 100vh;
      border: none;
    }

    .fourVideo {
      width: calc(50% - 4px);
      height: calc(50% - 4px);
    }

    .fourVideo.isFullscreen {
      height: 50vh;
      border: 0;
    }

    .sixVideo {
      width: calc(33.33% - 6px);
      height: calc(50% - 4px);
    }

    .sixVideo.isFullscreen {
      height: 50vh;
      border: 0;
    }

    .video-item {
      box-sizing: border-box;
      border: 2px solid transparent;
      border-radius: 8px;
      overflow: hidden;
      position: relative;

      .player {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
      }
    }

    .active {
      border: 2px solid #26ddff;
    }
  }
}
</style>
