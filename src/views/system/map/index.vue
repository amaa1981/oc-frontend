<template>
  <div class="map-page">
    <page-banner
      title="Alarm Map"
      subtitle="View, configure and manage alarm map and alert records"
      :deco-image="decoImage"
    />

    <div class="map-body">
      <div class="map-area">
        <div class="map-container" v-if="network">
          <div v-if="mapLoading" class="map-loading">
            <div class="loading-content">
              <i class="el-icon-loading"></i>
              <p>Loading map...</p>
            </div>
          </div>
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
            />
          </div>
        </div>
        <div class="map-container" v-else>
          <div class="error">
            <img :src="images" alt="" />
            <div>
              No network connection.<br />
              <span>Please check your internet connection and try again.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="record-panel">
        <div class="record-header">
          <span class="record-title">Alarm record</span>
        </div>
        <div class="record-list">
          <div
            class="record-item"
            v-for="(item, index) in list"
            :key="index"
            @click="showInfo(item.id)"
          >
            <div class="record-thumb">
              <img v-if="item.imageData" :src="'data:image/jpeg;base64,' + item.imageData" alt="" />
              <img v-else-if="item.imageUrl" :src="item.imageUrl" alt="" />
              <div v-else class="no-img"><i class="el-icon-picture-outline"></i></div>
            </div>
            <div class="record-info">
              <div class="record-time"><i class="el-icon-time"></i> {{ formatDate(item.sendTime || item.createTime) }}</div>
              <div class="record-type">{{ $t('dict.v1_alarm_type.' + item.eventTypeId) }}</div>
              <div class="record-device"><i class="el-icon-video-camera"></i> {{ item.equipmentName || item.deviceName }}</div>
            </div>
          </div>
          <div v-if="list.length === 0" class="no-records">No alarm records</div>
        </div>
      </div>
    </div>

    <alarm-detail
      :visible.sync="opens"
      :alarm-data="form"
      @refresh="getList"
      @close="opens = false"
    />
  </div>
</template>

<script>
import { listRecord, getRecord } from "@/api/system/record";
import images from "@/assets/images/neterror.png";
import MapboxMap from "@/components/MapboxMap/index.vue";
import AlarmDetail from "@/components/AlarmDetail";
import settings from "@/settings";
import decoImg from '@/assets/images/top_bg_right.png'

const defaultCenter = settings.mapConfig?.defaultCenter || [44.0, 23.0];

export default {
  dicts: ["v1_alarm_type"],
  components: { MapboxMap, AlarmDetail },
  data() {
    return {
      IP: "http://" + window.location.hostname,
      images: images,
      map: null,
      zoom: 5,
      center: [44.0, 23.0],
      position: [44.0, 23.0],
      list: [],
      form: {},
      opens: false,
      decoImage: decoImg,
      network: true,
      mapLoading: true,
      markers: [],
      resizeTimeout: null,
      branches: [
        { id: 'riyadh', name: 'Riyadh Branch', position: [46.6753, 24.7136], city: 'Riyadh' },
        { id: 'dammam', name: 'Dammam Branch', position: [50.1033, 26.4207], city: 'Dammam' },
        { id: 'jeddah', name: 'Jeddah Branch', position: [39.1925, 21.4858], city: 'Jeddah' },
        { id: 'mecca', name: 'Mecca Branch', position: [39.8579, 21.3891], city: 'Mecca' },
        { id: 'medina', name: 'Medina Branch', position: [39.6142, 24.4686], city: 'Medina' },
      ],
    };
  },
  computed: {
    listenData() {
      return this.$store.state.app.position;
    },
  },
  watch: {
    listenData(newVal) {
      this.center = [newVal.lng, newVal.lat];
      this.position = [newVal.lng, newVal.lat];
      this.getList();
      this.updateMarkers();
    },
  },
  async created() {
    await this.getList();
    this.updateMarkers();
  },
  mounted() {
    const appMain = document.querySelector('.app-main');
    if (appMain) { appMain.style.overflow = 'hidden'; appMain.style.padding = '0'; }
    window.addEventListener("offline", () => { this.network = false; });
    window.addEventListener("online", () => { this.network = true; });
    window.addEventListener("resize", this.handleResize);
    this.$nextTick(() => { setTimeout(() => { this.resizeMapbox(); }, 100); });
  },
  beforeDestroy() {
    const appMain = document.querySelector('.app-main');
    if (appMain) { appMain.style.overflow = ''; appMain.style.padding = ''; }
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    formatDate(val) {
      if (!val) return '-';
      const d = new Date(val);
      if (isNaN(d)) return val;
      const pad = n => String(n).padStart(2, '0');
      const year = String(d.getFullYear()).slice(2);
      return `${year}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },
    onMapInit(map) {
      this.map = map;
      this.mapLoading = false;
      this.$nextTick(() => { setTimeout(() => { this.resizeMapbox(); }, 100); });
    },
    handleResize() {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => { this.resizeMapbox(); }, 100);
    },
    resizeMapbox() {
      let mc = this.$refs.map;
      if (mc && mc.map && typeof mc.map.resize === "function") mc.map.resize();
      else if (mc && typeof mc.resize === "function") mc.resize();
    },
    onMapClick(e) { console.log("Map click", e); },
    onMarkerClick(e) {
      if (e.marker && e.marker.id) this.showInfo(e.marker.id);
    },
    updateMarkers() {
      this.markers = [];

      // Branch markers
      this.branches.forEach(branch => {
        this.markers.push({
          id: branch.id,
          position: branch.position,
          visible: true,
          draggable: false,
          popup: `
            <div style="padding:12px;font-family:sans-serif;">
              <h4 style="margin:0 0 8px;color:#1a2a36;font-size:14px;">🏢 ${branch.name}</h4>
              <p style="margin:0;color:#666;font-size:12px;">📍 ${branch.city}, Saudi Arabia</p>
            </div>
          `,
        });
      });

      // Alert markers
      this.list.forEach(item => {
        if (item.coordinate) {
          const coords = item.coordinate.split(",");
          this.markers.push({
            id: item.id,
            position: [Number(coords[0]), Number(coords[1])],
            visible: true,
            draggable: false,
            popup: `
              <div style="padding:12px;font-family:sans-serif;">
                <h4 style="margin:0 0 8px;color:#e53935;font-size:14px;">⚠️ ${this.$t('dict.v1_alarm_type.' + item.eventTypeId)}</h4>
                <p style="margin:0 0 4px;color:#666;font-size:12px;">📷 ${item.equipmentName || item.deviceName || 'Device'}</p>
                <p style="margin:0 0 8px;color:#666;font-size:12px;">🕐 ${this.formatDate(item.sendTime || item.createTime)}</p>
                ${item.imageData ? `<img src="data:image/jpeg;base64,${item.imageData}" style="width:150px;height:auto;border-radius:4px;" />` : ''}
              </div>
            `,
          });
        }
      });
    },
    showInfo(id) {
      getRecord(id).then(response => {
        this.form = response.data;
        this.opens = true;
      });
    },
    async getList() {
      const r = await listRecord({ pageNum: 1, pageSize: 10 });
      this.list = r.data.records || [];
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
      ::v-deep .system-map { width: 100% !important; height: 100% !important; display: block; }
    }

    .map-loading {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;

      .loading-content {
        text-align: center;
        color: #909399;
        i { font-size: 28px; margin-bottom: 10px; display: block; }
        p { margin: 0; font-size: 14px; }
      }
    }

    .error {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img { width: 120px; margin-bottom: 16px; }
      div { color: #909399; text-align: center; font-size: 16px; }
      span { font-size: 13px; }
    }
  }
}

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
    .record-title { font-size: 15px; font-weight: 600; color: #1a2a36; }
  }

  .record-list {
    flex: 1;
    overflow-y: auto;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #dcdfe6; border-radius: 4px; }
  }

  .no-records {
    text-align: center;
    color: #909399;
    padding: 40px 0;
    font-size: 13px;
  }

  .record-item {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid #f2f3f5;
    &:hover { background: #f5f7fa; }

    .record-thumb {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      background: #f0f2f5;
      display: flex;
      align-items: center;
      justify-content: center;
      img { width: 100%; height: 100%; object-fit: cover; }
      .no-img { color: #c0c4cc; font-size: 24px; }
    }

    .record-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;

      .record-time { font-size: 11px; color: #909399; i { margin-right: 3px; } }
      .record-type { font-size: 13px; font-weight: 600; color: #1a2a36; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .record-device { font-size: 11px; color: #909399; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; i { margin-right: 3px; } }
    }
  }
}

@media (max-width: 768px) {
  .map-body { flex-direction: column; }
  .record-panel { width: 100%; height: 300px; }
}
</style>