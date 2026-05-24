<template>
  <div class="smart-map-container">
    <!-- Mapbox map -->
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

    <!-- Amap -->
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

    <!-- Google Maps -->
    <div
      v-else-if="currentMapService === 'google'"
      :id="mapId"
      :class="mapClass"
      ref="googleMapRef"
    ></div>

    <!-- Map service switcher -->
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

    <!-- Location information prompts -->
    <div class="location-info" v-if="showLocationInfo">
      <span>Current location: {{ locationDescription }}</span>
      <span>Recommended map: {{ mapConfigs[currentMapService]?.name }}</span>
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
      default: () => [116.397428, 39.90923], // Default center
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
      default: true, // Auto-detect best map service
    },
    markers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentMapService: "mapbox", // Default to Mapbox
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
        { value: "amap", label: "AMap" },
        { value: "google", label: "Google Maps" },
      ],
    };
  },
  computed: {
    locationDescription() {
      const [lng, lat] = this.center;
      return isInChina(lng, lat) ? "China" : "Overseas";
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
    // Detect the most suitable map service
    detectBestMapService(center) {
      const [lng, lat] = center;
      const recommended = getRecommendedMapService(lng, lat);

      if (recommended !== this.currentMapService) {
        console.log(`Location changed; recommended${mapConfigs[recommended].name}`);
        this.currentMapService = recommended;
      }
    },

    // Mapbox map event handling
    onMapInit(map) {
      this.$emit("map-init", map);
    },
    onMapClick(e) {
      this.$emit("map-click", e);
    },
    onMarkerClick(e) {
      this.$emit("marker-click", e);
    },

    // Switch map service
    switchMapService(service) {
      console.log(`Switched to${mapConfigs[service].name}`);
      this.currentMapService = service;
      this.$emit("service-changed", service);

      // If Switched to Google Maps, initialization is required
      if (service === "google") {
        this.$nextTick(() => {
          this.initGoogleMap();
        });
      }
    },

    // Initializing Google Map
    initGoogleMap() {
      // Here you need to load the Google Maps API
      console.log("Initializing Google Map");
      // Actual implementation requires Google Maps API Key
    },

    // Get the current map instance
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