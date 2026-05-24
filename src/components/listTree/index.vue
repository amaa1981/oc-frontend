<!--
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-09 16:21:08
 * @LastEditTime: 2025-07-01 14:23:40
 * @LastEditors: FGJ
 * @Description:
 * @FilePath: \ruoyi-ui\src\components\listTree\index1.vue
-->
<template>
  <div class="container">
    <div class="monitor-list-wrap">
      <div class="title">{{ $t("monitor.list") }}</div>
      <div class="monitor-list">
        <div class="list">
          <div
            class="monitor-item"
            v-for="(item, index) in monitorList"
            :key="item.id"
            @click="playVideo(item, index)"
          >
            <i class="el-icon-video-camera monitor-icon" />
            <span class="monitor-name" :title="item.name">
              {{ item.name }}
            </span>
            <span
              class="monitor-state active"
              @click.stop="closePlayer(item.id)"
              v-show="item.select"
            >
              {{ $t("commonBtn.close") }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="monitor-list-wrap">
      <div class="title">Access Control List</div>
      <div class="monitor-list">
        <div class="list">
          <div class="monitor-item" v-for="item in controlList" :key="item.id">
            <span class="monitor-name" :title="item.name">
              {{ item.name }}
            </span>
            <el-button
              type="primary"
              size="mini"
              @click="handleSwitchChange(item)"
            >
              Open Door
            </el-button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { close } from "../../utils/wsMessage.js";
import { listDeviceAll } from "@/api/system/device";
import { listControl, operate } from "@/api/system/control";
export default {
  data() {
    return {
      monitorList: [],
      // Record the idList being played
      playingList: new Set(),
      // Store the index corresponding to the id
      indexMap: new Map(),
      controlList: [],
      activeNames: ["1"],
    };
  },
  created() {},
  mounted() {
    this.getDeviceList();
    // Monitor device area changes
    this.$bus.$on("installationAreaChange", this.onInstallationAreaChange);
    // Mount $bus
    this.$bus.$on("addVideoId", (infoObj) => {
      console.log("The device List receives the addVideoId event:", infoObj.videoId);
      // Add playback id to List
      this.playingList.add(infoObj.videoId);
      // Find the corresponding device index
      const deviceIndex = this.monitorList.findIndex(
        (item) => item.id === infoObj.videoId
      );
      if (deviceIndex !== -1) {
        // Establish mapping relationship
        this.indexMap.set(infoObj.videoId, deviceIndex);
        // Update display status to Playing
        this.$set(this.monitorList[deviceIndex], "select", true);
        console.log(`device ${infoObj.videoId} Status has been updated to Playing，Show close button`);
      } else {
        console.warn(`not founddevice ${infoObj.videoId} in deviceListmiddle`);
      }
    });
    this.$bus.$on("removeVideoId", (infoObj) => {
      console.log("The device List receives the removeVideoId event:", infoObj.videoId);
      // Remove playback id to List
      this.playingList.delete(infoObj.videoId);
      if (this.indexMap.has(infoObj.videoId)) {
        this.$set(
          this.monitorList[this.indexMap.get(infoObj.videoId)],
          "select",
          false
        );
        this.indexMap.delete(infoObj.videoId);
        console.log(
          `device ${infoObj.videoId} status updated to stopped, hiding close button`
        );
      }
    });
  },
  computed: {},
  watch: {},
  methods: {
    // Get device list
    getDeviceList() {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        installationArea: localStorage.getItem('installationArea') || null,
      };
      listDeviceAll(params).then((response) => {
        this.monitorList = [];
        for (let i = 0; i < response.data.length; i++) {
          this.monitorList.push({
            id: response.data[i].id,
            name: response.data[i].deviceName,
            select: this.playingList.has(response.data[i].id),
            rtspUrl: response.data[i].subRtsp,
          });
        }
      });
    },
    // Device area change processing
    onInstallationAreaChange(val) {
      this.getDeviceList();
    },
    handleSwitchChange(item) {
      operate({
        id: item.id,
        staic: 1,
      }).then((response) => {
        console.log(response);
        if (response.code == 200) {
          this.$modal.msgSuccess(this.$t("commonTips.operate_s"));
        }
      });
    },
    closePlayer(id) {
      close({
        videoId: id,
      });
    },
    playVideo(node, index) {
      if (this.playingList.has(node.id)) {
        this.$message({
          message: this.$t("monitor.playTip"),
          type: "warning",
        });
        return;
      }
      // Trigger custom event
      this.$bus.$emit("sendOpenInfo", {
        videoId: node.id,
        label: node.name,
        rtspUrl: node.rtspUrl,
      });
      this.indexMap.set(node.id, index);
    },
  },
  beforeDestroy() {
    this.playingList.clear();
    this.indexMap.clear();
    this.playingList = null;
    this.indexMap = null;
    // Remove listening
    this.$bus.$off("installationAreaChange", this.onInstallationAreaChange);
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 280px !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  .monitor-list-wrap {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .title {
      width: 100%;
      box-sizing: border-box;
      padding: 16px 20px;
      font-size: 16px;
      font-weight: 600;
      color: #1a2a36;
      border-bottom: 1px solid #ebeef5;
      flex-shrink: 0;
    }

    .monitor-list {
      flex: 1;
      box-sizing: border-box;
      width: 100%;
      padding: 8px 12px;
      overflow: hidden;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #dcdfe6;
        border-radius: 4px;
      }

      .list {
        width: 100%;
        box-sizing: border-box;

        .monitor-item {
          margin-top: 4px;
          background-color: #f5f7fa;
          border: 1px solid transparent;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          width: 100%;
          border-radius: 8px;
          box-sizing: border-box;
          transition: all 0.2s;

          &:hover {
            background: #ecf5ff;
            cursor: pointer;
            border-color: #b3d8ff;
          }

          .monitor-icon {
            font-size: 16px;
            color: #26a69a;
            flex-shrink: 0;
            margin-right: 8px;
          }

          .monitor-name {
            flex: 1;
            font-size: 14px;
            font-weight: 500;
            color: #1a2a36;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .monitor-state {
            flex-shrink: 0;
            font-size: 12px;
            color: #909399;
            padding: 2px 8px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            margin-left: 8px;
            background: transparent;
            transition: all 0.2s;

            &:hover {
              cursor: pointer;
              color: #f56c6c;
              border-color: #f56c6c;
            }
          }

          .active {
            color: #409eff;
            border-color: #409eff;
          }
        }

        .active {
          border-color: #409eff;
          background: #ecf5ff;
        }
      }

      .list::-webkit-scrollbar {
        width: 0px;
      }
    }
  }
}
</style>
