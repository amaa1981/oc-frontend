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
      // Make sure that each time you open the page, you only receive a pop-up window to download the plug-in.
      isDownload: true,
      // Get edge position timer
      intervalId: null,
      // Distance from browser to left edge of system desktop
      screenX: window.screenX,
      // Distance from browser to left edge of system desktop
      screenY: window.screenY,
      // Whether to full screen
      fullscreen: false,
      // Whether to minimize the Label page or switch the Label page
      isHiddenTab: false,
      // Split screen button configuration
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
      // Current number of split screens -- default is 4
      playerLength: 0,
      // The currently highlighted split screen subscript
      playerIdx: 0,
      // Playlist of current split screen
      players: [],
      // Hidden playlist
      oldPlayers: [],
      // Record the current playback map
      isPlayingList: new Map(),
    };
  },
  components: {
    Player,
  },
  created() {
    // connection service
    createSocket(window.g.wsBaseURL);
    // Set the initial number of split screens to 4
    this.setPlayerLength(4);
    // Configuration restore will be performed after successful WebSocket connection
    // store.state.mqtt.showList is populated into players
    // this.players = store.state.mqtt.showList;
    // // Fill store.state.mqtt.showList into isPlayingList
    // for (let item of this.players) {
    //   this.isPlayingList.set(item.videoId, {
    //     rtspUrl: item.rtspUrl,
    //     index: item.index,
    //   });
    // }
  },
  mounted() {
    let _this = this;
    // Turn on the timer to continuously obtain the position of the browser from the edge of the system desktop
    this.intervalId = setInterval(() => {
      _this.handlerScreeMove();
    }, 80);
    // Register ws connection listening callback
    window.addEventListener("onWSOpen", this.handlerOpenWS);
    // Register to listen to ws message receiving events
    window.addEventListener("onMessageWS", this.getSocketData);
    // Register to listen for Label page minimize or switch events
    document.addEventListener("visibilitychange", this.handleVisiable);
    // Register to listen for window refresh or close events
    window.addEventListener("beforeunload", this.handlerDestory);
    // Monitor the scrolling of the page and notify the plug-in to follow the movement
    this._onScroll = () => { this.$bus.$emit("move") }
    window.addEventListener("scroll", this._onScroll, true)
    // Mount $bus -- play event
    this.$bus.$on("sendOpenInfo", (infoObj) => {
      // Execute playback events and support silent mode (repeat play prompt will not be displayed when restoring configuration)
      this.play(infoObj, infoObj.silent || false);
    });
  },
  computed: {},
  watch: {
    // monitorstoreinopensstate
    "$store.state.mqtt.opens": {
      handler(newVal) {
        console.log("mqtt.opens status changed to:", newVal);
        // Add processing logic here when mqtt.opens status changes, if needed
        if (newVal) {
          this.hideAll();
        } else {
          this.showAll();
        }
      },
      deep: true,
    },
    // Monitor the distance from the browser to the left edge of the system desktop
    screenX(newVal) {
      if (!this.isHiddenTab) {
        this.$bus.$emit("move");
      }
    },
    // Monitor the distance from the browser to the upper edge of the system desktop
    screenY(newVal) {
      if (!this.isHiddenTab) {
        this.$bus.$emit("move");
      }
    },
    // Monitor the current number of split screens
    playerLength(newVal, oldVal) {
      // Switched to more split screens without changing current players; add empty slots
      if (newVal > oldVal) {
        for (let index = oldVal; index < newVal; index++) {
          this.setVideoToScreen(index);
        }
      } else {
        // Switched to less split screen
        // First hide the video being played in the current split screen
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
        // Remove redundant split screens
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
    // Handle page refresh or close, or Destroy the current instance
    handlerDestory() {
      // Send ws message -- close all videos
      closeAll({
        type: "closeAll",
      });
      // Disconnect webSocket
      closeWebsocket();
      // clear timer
      clearInterval(this.intervalId);
      // clear map
      this.isPlayingList.clear();
      // Clear store.state.mqtt.showList
      store.dispatch("mqtt/setShowList", []);
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
          for (const item of this.players) {
            if (item.type === "show") {
              item.type = "hidden";
            }
          }
          break;
        // Normally open
        case "visible":
          this.isHiddenTab = false;
          // Delay recovery display to ensure page rendering is completed
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
    // Establish websocket connection
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
            // Check network connection status
            try {
              await internetAvailable({
                timeout: 3000,
                retries: 2,
              });
              // If you have an internet connection, use the cloud to download
              window.location =
                "https://web-1318283609.cos.ap-guangzhou.myqcloud.com/tool/ChromePlayer_x64.exe";
            } catch (error) {
              // No network, use local path
              console.log("Network unavailable; using local installer");
              window.location = "/ChromePlayer_x64.exe";
            }
          })
          .catch(() => {});
      } else if (isOpen) {
        console.log("WebSocket connected; restoring configuration");
        // Restore the configuration after the WebSocket connection is successful, and delay to ensure that the device List component has also been loaded.
     
          this.restoreConfig();
     
      }
    },
    // Assign the latest browser edge distance
    handlerScreeMove() {
      this.screenX = window.screenX;
      this.screenY = window.screenY;
    },
    // Accept WS message callback
    getSocketData(res) {
      const data = res && res.detail.data;
      try {
        let res = JSON.parse(data);
        if (res.code !== 200) {
          // this.$message({
          //   message: this.$t("monitor.fail"),
          //   type: "warning",
          // });
          console.debug("Operation failed");
        } else {
          switch (res.type) {
            case "open":
              let idx = 0;
              // Notify List component
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
              // Remove the corresponding information from the played list
              if (
                this.players[this.isPlayingList.get(res.videoId).index].type !==
                "open"
              ) {
                // It means that this window is not playing other channels at this time.
                this.setPlayerData(this.isPlayingList.get(res.videoId).index);
              }
              this.isPlayingList.delete(res.videoId);
              // Notify List component
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
    // Set dynamic data for players
    setPlayerData(index, rtspUrl = "", label = "", type = "", videoId = "") {
      this.$set(this.players, index, {
        rtspUrl,
        id: index, // video element ID - plugin checks for elements with class starting with "video"
        label,
        type,
        videoId, // Unique monitor ID
      });
    },
    // Reassign the hidden Video to the new split screen
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
    // Set the number of playback screens
    setPlayerLength(num) {
      if (num === this.players.length) return;
      this.playerIdx = 0;
      this.playerLength = num;
    },
    // Toggle full screen
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
    // Switch playback screen
    changePlayScreen(index) {
      this.playerIdx = index;
    },
    // Play event
    play(obj, silent = false) {
      if (this.isPlayingList.has(obj.videoId)) {
        // Tip is not shown when silent is true (used to restore configuration)
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
    // Save current configuration to localStorage
    saveCurrentConfig() {
      try {
        // Collect information about the device being played and its location
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

        console.log("Saved monitoring configuration:");
        console.log(`- Split screen count: ${config.playerLength}`);
        console.log(`- Playing device count: ${playingDevices.length}`);
        playingDevices.forEach((device) => {
          console.log(
            `  · device ${device.videoId} (${device.label}) at position ${device.screenIndex}`
          );
        });
        console.log(`- Saved at: ${config.savedAt}`);
      } catch (error) {
        console.error("Failed to save configuration:", error);
        this.$message({
          message: this.$t("monitor.saveFailed") || "Failed to save settings",
          type: "error",
        });
      }
    },
    // Restore configuration from localStorage
    restoreConfig() {
      try {
        const savedConfig = localStorage.getItem("monitor_config");
        if (savedConfig) {
          const config = JSON.parse(savedConfig);

          console.log("Restoring monitoring configuration:");
          console.log(`- Saved at: ${config.savedAt || "unknown"}`);
          console.log(`- Split screen count: ${config.playerLength}`);
          console.log(
            `- saved device count: ${config.players ? config.players.length : 0}`
          );

          // Number of recovery screens
          if (config.playerLength && [1, 4, 6].includes(config.playerLength)) {
            console.log(`recoverSplit screen count: ${config.playerLength}`);
            this.setPlayerLength(config.playerLength);
          } else {
            console.warn(`InvalidSplit screen count: ${config.playerLength}，useDefault Value4`);
            this.setPlayerLength(4);
          }

          // Delay the recovery of the playing device and ensure that the split screen has been set up
          setTimeout(() => {
            if (config.players && config.players.length > 0) {
              // Used to track occupied screen position
              const occupiedPositions = new Set();

              // Restoring device by original playback position
              config.players.forEach((savedPlayer, configIndex) => {
                // Use saved screen position index
                const targetScreenIndex = savedPlayer.screenIndex;

                // Check if the target location is valid and unoccupied
                if (
                  targetScreenIndex >= 0 &&
                  targetScreenIndex < this.playerLength &&
                  savedPlayer.videoId &&
                  !occupiedPositions.has(targetScreenIndex)
                ) {
                  // The marked position is already occupied
                  occupiedPositions.add(targetScreenIndex);

                  // Restore playing device information to the specified location
                  this.setPlayerData(
                    targetScreenIndex,
                    savedPlayer.rtspUrl,
                    savedPlayer.label,
                    "open",
                    savedPlayer.videoId
                  );

                  // Add to Now Playing List, using correct screen index
                  this.isPlayingList.set(savedPlayer.videoId, {
                    rtspUrl: savedPlayer.rtspUrl,
                    index: targetScreenIndex,
                  });

                  console.log(
                    `✓ restoring device ${savedPlayer.videoId} (${savedPlayer.label}) to original screen position ${targetScreenIndex}`
                  );

                  // Delay triggering of playback events, and WebSocket will automatically notify the device of List update status when responding.
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
                  // Handle invalid or conflicting locations
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

              // Statistical recovery results
              const totalDevices = config.players.length;
              const restoredDevices = occupiedPositions.size;
              const skippedDevices = totalDevices - restoredDevices;

              console.log(
                "=================== Configuration restore complete ==================="
              );
              console.log(`📊 Restore statistics:`);
              console.log(`  - Total devices: ${totalDevices}`);
              console.log(`  - Restored successfully: ${restoredDevices}`);
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
        console.error("Failed to restore configuration:", error);
      }
    },
  },
  beforeDestroy() {
    console.log("beforeDestroy");
    console.log("Destroy");
    //Uninstall event listening
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

  // The wrapping layer rendered by the vue-fullscreen component
  .fullscreen {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  // vue-fullscreen may generate additional divs internally and use ::v-deep to penetrate them
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
