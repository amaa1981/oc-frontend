<template>
  <div class="smart-map-container">
    <!-- Mapbox 地图 -->
    <mapbox-map
      v-if="currentMapService === 'mapbox'"
      :center="center"
      :zoom="zoom"
      :map-class="mapClass"
      :map-id="mapId"
      :markers="markers"
      @map-init="onMapInit"
      @map-click="onMapClick"
      @marker-click="onMarkerClick"
      ref="mapboxRef"
    >
    </mapbox-map>

    <!-- 高德地图 -->
    <el-amap
      v-else-if="currentMapService === 'amap'"
      :vid="mapId"
      :center="center"
      :zoom="zoom"
      :class="mapClass"
      :events="amapEvents"
      :plugin="amapPlugin"
      ref="amapRef"
    >
      <slot name="amap-content"></slot>
    </el-amap>

    <!-- Google地图 -->
    <div
      v-else-if="currentMapService === 'google'"
      :id="mapId"
      :class="mapClass"
      ref="googleMapRef"
    ></div>

    <!-- 地图服务切换器 -->
    <div class="map-service-switcher" v-if="showSwitcher">
      <el-select
        v-model="currentMapService"
        size="mini"
        @change="switchMapService"
      >
        <el-option
          v-for="service in availableServices"
          :key="service.value"
          :label="service.label"
          :value="service.value"
        ></el-option>
      </el-select>
    </div>

    <!-- 位置信息提示 -->
    <div class="location-info" v-if="showLocationInfo">
      <span>当前位置：{{ locationDescription }}</span>
      <span>推荐地图：{{ mapConfigs[currentMapService]?.name }}</span>
    </div>
  </div>
</template>

<script>
import MapboxMap from "@/components/MapboxMap/index.vue";
import {
  isInChina,
  getRecommendedMapService,
  mapConfigs,
} from "@/utils/mapUtils";

export default {
  name: "SmartMap",
  components: {
    MapboxMap,
  },
  props: {
    center: {
      type: Array,
      default: () => [116.397428, 39.90923], // 默认北京
    },
    zoom: {
      type: Number,
      default: 10,
    },
    mapClass: {
      type: String,
      default: "smart-map",
    },
    mapId: {
      type: String,
      default: "smartMap",
    },
    showSwitcher: {
      type: Boolean,
      default: true,
    },
    showLocationInfo: {
      type: Boolean,
      default: false,
    },
    autoDetect: {
      type: Boolean,
      default: true, // 是否自动检测最适合的地图服务
    },
    markers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentMapService: "mapbox", // 默认使用 Mapbox
      mapConfigs,
      amapPlugin: ["ToolBar", "Scale"],
      amapEvents: {
        init: (map) => {
          this.$emit("map-init", map);
        },
        click: (e) => {
          this.$emit("map-click", e);
        },
      },
      availableServices: [
        { value: "mapbox", label: "Mapbox GL JS" },
        { value: "amap", label: "高德地图" },
        { value: "google", label: "Google地图" },
      ],
    };
  },
  computed: {
    locationDescription() {
      const [lng, lat] = this.center;
      return isInChina(lng, lat) ? "中国境内" : "海外地区";
    },
  },
  watch: {
    center: {
      handler(newCenter) {
        if (this.autoDetect) {
          this.detectBestMapService(newCenter);
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 检测最适合的地图服务
    detectBestMapService(center) {
      const [lng, lat] = center;
      const recommended = getRecommendedMapService(lng, lat);

      if (recommended !== this.currentMapService) {
        console.log(`位置变化，推荐使用${mapConfigs[recommended].name}`);
        this.currentMapService = recommended;
      }
    },

    // Mapbox 地图事件处理
    onMapInit(map) {
      this.$emit("map-init", map);
    },
    onMapClick(e) {
      this.$emit("map-click", e);
    },
    onMarkerClick(e) {
      this.$emit("marker-click", e);
    },

    // 切换地图服务
    switchMapService(service) {
      console.log(`切换到${mapConfigs[service].name}`);
      this.currentMapService = service;
      this.$emit("service-changed", service);

      // 如果切换到Google地图，需要初始化
      if (service === "google") {
        this.$nextTick(() => {
          this.initGoogleMap();
        });
      }
    },

    // 初始化Google地图
    initGoogleMap() {
      // 这里需要加载Google Maps API
      console.log("初始化Google地图");
      // 实际实现需要Google Maps API Key
    },

    // 获取当前地图实例
    getMapInstance() {
      if (this.currentMapService === "amap") {
        return this.$refs.amapRef;
      } else if (this.currentMapService === "google") {
        return this.$refs.googleMapRef;
      }
      return null;
    },
  },
};
</script>

<style scoped>
.smart-map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.smart-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.map-service-switcher {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.location-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.location-info span {
  display: block;
  margin-bottom: 2px;
}

.location-info span:last-child {
  margin-bottom: 0;
}
</style> 