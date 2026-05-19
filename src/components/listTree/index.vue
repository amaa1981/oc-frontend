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
      <div class="title">门禁列表</div>
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
              开门
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
      // 记录正在播放的id列表
      playingList: new Set(),
      // 存放id对应的index
      indexMap: new Map(),
      controlList: [],
      activeNames: ["1"],
    };
  },
  created() {},
  mounted() {
    this.getDeviceList();
    // 监听设备区域变化
    this.$bus.$on("installationAreaChange", this.onInstallationAreaChange);
    // 挂载$bus
    this.$bus.$on("addVideoId", (infoObj) => {
      console.log("设备列表接收到addVideoId事件:", infoObj.videoId);
      // 添加播放id到列表
      this.playingList.add(infoObj.videoId);
      // 查找对应的设备索引
      const deviceIndex = this.monitorList.findIndex(
        (item) => item.id === infoObj.videoId
      );
      if (deviceIndex !== -1) {
        // 建立映射关系
        this.indexMap.set(infoObj.videoId, deviceIndex);
        // 更新显示状态为播放中
        this.$set(this.monitorList[deviceIndex], "select", true);
        console.log(`设备 ${infoObj.videoId} 状态已更新为播放中，显示关闭按钮`);
      } else {
        console.warn(`未找到设备 ${infoObj.videoId} 在设备列表中`);
      }
    });
    this.$bus.$on("removeVideoId", (infoObj) => {
      console.log("设备列表接收到removeVideoId事件:", infoObj.videoId);
      // 移除播放id到列表
      this.playingList.delete(infoObj.videoId);
      if (this.indexMap.has(infoObj.videoId)) {
        this.$set(
          this.monitorList[this.indexMap.get(infoObj.videoId)],
          "select",
          false
        );
        this.indexMap.delete(infoObj.videoId);
        console.log(
          `设备 ${infoObj.videoId} 状态已更新为停止播放，隐藏关闭按钮`
        );
      }
    });
  },
  computed: {},
  watch: {},
  methods: {
    // 获取设备列表
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
    // 设备区域变化处理
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
      // 触发自定义事件
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
    // 移除监听
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
