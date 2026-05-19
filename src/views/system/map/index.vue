<template>
  <div class="map-page">
    <!-- Banner -->
    <page-banner
      :title="$t('alarmMap.title')"
      :subtitle="$t('alarmMap.subtitle')"
      :deco-image="decoImage"
    />

    <div class="map-body">
    <div class="map-area">
      <!-- 地图区域 -->
      <div class="map-container" v-if="network">
        <!-- 地图加载状态 -->
        <div v-if="mapLoading" class="map-loading">
          <div class="loading-content">
            <i class="el-icon-loading"></i>
            <p>Loading...</p>
          </div>
        </div>

        <!-- Mapbox 地图 -->
        <div class="mapbox-map-wrapper">
          <mapbox-map
            v-show="!mapLoading"
            :center="center"
            :zoom="zoom"
            :markers="markers"
            map-id="systemMapbox"
            map-class="system-map"
            @map-init="onMapInit"
            @map-click="onMapClick"
            @marker-click="onMarkerClick"
            ref="map"
          ></mapbox-map>
        </div>
      </div>
      <!-- 断网显示 -->
      <div class="map-container" v-else>
        <div class="error">
          <img :src="images" alt="" />
          <div>
            {{ $t("modal.errornet1") }} <br />
            <span> {{ $t("modal.errornet2") }} </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧告警记录面板 -->
    <div class="record-panel">
      <div class="record-header">
        <span class="record-title">{{ $t("alarmMap.alarmRecord") }}</span>
      </div>
      <div class="record-list">
        <div
          class="record-item"
          v-for="(item, index) in list"
          :key="index"
          @click="showInfo(item.id)"
        >
          <div class="record-thumb">
            <img :src="item.imageUrl" alt="" />
          </div>
          <div class="record-info">
            <div class="record-time">
              <i class="el-icon-time"></i> {{ item.sendTime }}
            </div>
            <div class="record-type">
              {{ $t("dict.v1_alarm_type." + item.eventTypeId) }}
            </div>
            <div class="record-device">
              <i class="el-icon-video-camera"></i> {{ item.equipmentName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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

import {
  listRecord,
  getRecord,
  delRecord,
  updateRecord,
} from "@/api/system/record";
import images from "@/assets/images/neterror.png";
import MapboxMap from "@/components/MapboxMap/index.vue";
import AlarmDetail from "@/components/AlarmDetail";
import settings from "@/settings";
import decoImg from '@/assets/images/top_bg_right.png'

// 获取全局地图默认中心坐标
const defaultCenter = settings.mapConfig?.defaultCenter ;

export default {
  dicts: ["v1_alarm_type"],
  components: {
    MapboxMap,
    AlarmDetail,
  },
  data() {
    return {
      IP: "http://" + window.location.hostname,
      strRes: {},
      images: images,
      map: null,
      zoom: 13, //缩放
      center: [...defaultCenter], //中心坐标 [lng, lat]
      position: [...defaultCenter], //选中坐标
      list: [], //告警记录
      //报警详情
      form: {},
      //报警详情
      opens: false,
      decoImage: decoImg,
      network: true, //默认有网
      mapLoading: true, // 地图加载状态
      markers: [], // 标记点数组
      resizeTimeout: null, // 新增
    };
  },
  computed: {
    listenData() {
      return this.$store.state.app.position;
    },
  },
  watch: {
    listenData(newVal, oldVal) {
      this.center = [newVal.lng, newVal.lat];
      this.position = [newVal.lng, newVal.lat];
      this.getList();
      this.updateMarkers();
    },
  },
  async created() {
    console.log("开始加载地图数据...");
    await this.getList();
    console.log("地图数据加载完成:", this.list);
    if (this.list.length > 0) {
      this.center = [
        Number(this.list[0].coordinate.split(",")[0]),
        Number(this.list[0].coordinate.split(",")[1]),
      ];
      this.position = [
        Number(this.list[0].coordinate.split(",")[0]),
        Number(this.list[0].coordinate.split(",")[1]),
      ];
    }

    this.updateMarkers();
  },
  mounted() {
    // 让 app-main 撑满且不产生多余滚动空间
    const appMain = document.querySelector('.app-main')
    if (appMain) {
      appMain.style.overflow = 'hidden'
      appMain.style.padding = '0'
    }
    console.log("地图组件已挂载");
    // 检测断网
    window.addEventListener("offline", () => {
      this.network = false;
    });
    window.addEventListener("online", () => {
      this.network = true;
    });

    // 监听窗口resize，修复地图尺寸
    window.addEventListener("resize", this.handleResize);

    // 地图容器初始修正
    this.$nextTick(() => {
      setTimeout(() => {
        this.resizeMapbox();
      }, 100);
    });
  },
  beforeDestroy() {
    // 恢复 app-main overflow 和 padding
    const appMain = document.querySelector('.app-main')
    if (appMain) {
      appMain.style.overflow = ''
      appMain.style.padding = ''
    }
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    // Mapbox 地图事件处理
    onMapInit(map) {
      console.log("Mapbox 地图初始化完成", map);
      this.map = map;
      this.mapLoading = false;
      // 地图初始化后立即resize一次，确保尺寸正常
      this.$nextTick(() => {
        setTimeout(() => {
          this.resizeMapbox();
        }, 100);
      });
    },

    handleResize() {
      // 防抖
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resizeMapbox();
      }, 100);
    },

    resizeMapbox() {
      // 兼容不同Mapbox组件写法
      let mapComponent = this.$refs.map;
      if (
        mapComponent &&
        mapComponent.map &&
        typeof mapComponent.map.resize === "function"
      ) {
        mapComponent.map.resize();
      } else if (mapComponent && typeof mapComponent.resize === "function") {
        mapComponent.resize();
      }
    },

    onMapClick(e) {
      console.log("地图点击事件", e);
    },

    onMarkerClick(e) {
      console.log("标记点击事件", e);
      // 可以在这里处理标记点击，比如显示详情
      if (e.marker && e.marker.id) {
        this.showInfo(e.marker.id);
      }
    },

    // 更新地图标记点
    updateMarkers() {
      this.markers = [];
      if (this.list.length > 0) {
        this.list.forEach((item, index) => {
          if (item.coordinate) {
            const coords = item.coordinate.split(",");
            this.markers.push({
              id: item.id, // 添加ID用于点击识别
              position: [Number(coords[0]), Number(coords[1])],
              visible: true,
              draggable: false,
              popup: `
                <div style="padding: 10px;">
                  <h4>${item.equipmentName || "设备"}</h4>
                  <p><strong>时间:</strong> ${item.sendTime}</p>
                  <p><strong>类型:</strong> ${this.$t(
                    "dict.v1_alarm_type." + item.eventTypeId
                  )}</p>
                  <img src="${
                    item.imageUrl
                  }" style="width: 150px; height: auto; margin-top: 10px;" />
                </div>
              `,
            });
          }
        });
      }
      // 列表没有记录时不显示任何点位
    },
    //显示报警信息
    showInfo(id) {
      getRecord(id).then((response) => {
        this.form = response.data;
        this.opens = true;
      });
    },
    go() {
      this.$router.push({
        path: "/alarmmanger/record",
      });
    },
    async getList() {
      let r = await listRecord({ pageNum: 1, pageSize: 10 });
      this.list = r.data.records;
      this.updateMarkers();
    },
  },
};
</script>

<style lang="scss" scoped>
.map-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  gap: 16px;
  box-sizing: border-box;
  overflow: hidden;
}

// ==================== Body ====================
.map-body {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 16px;
}

.map-area {
  flex: 1;
  min-width: 0;

  .map-container {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    position: relative;

    .mapbox-map-wrapper {
      width: 100%;
      height: 100%;

      ::v-deep .system-map {
        width: 100% !important;
        height: 100% !important;
        display: block;
      }
    }

    .map-loading {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f7fa;

      .loading-content {
        text-align: center;
        color: #909399;

        i {
          font-size: 28px;
          margin-bottom: 10px;
          display: block;
        }

        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }

    .error {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      img {
        width: 120px;
        margin-bottom: 16px;
      }

      div {
        color: #909399;
        text-align: center;
        font-size: 16px;

        span {
          font-size: 13px;
        }
      }
    }
  }
}

// ==================== Record Panel ====================
.record-panel {
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .record-header {
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;
    flex-shrink: 0;

    .record-title {
      font-size: 15px;
      font-weight: 600;
      color: #1a2a36;
    }
  }

  .record-list {
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #dcdfe6;
      border-radius: 4px;
    }
  }

  .record-item {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid #f2f3f5;

    &:hover {
      background: #f5f7fa;
    }

    .record-thumb {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      background: #f0f2f5;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .record-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;

      .record-time {
        font-size: 11px;
        color: #909399;

        i {
          margin-right: 3px;
        }
      }

      .record-type {
        font-size: 13px;
        font-weight: 600;
        color: #1a2a36;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .record-device {
        font-size: 11px;
        color: #909399;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        i {
          margin-right: 3px;
        }
      }
    }
  }
}
</style>
