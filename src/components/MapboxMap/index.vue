<template>
  <div class="mapbox-container">
    <div
      :id="mapId"
      :class="mapClass"
      class="mapbox-map"
      ref="mapContainer"
    ></div>

    <!-- 地图加载状态 -->
    <div v-if="loading" class="map-loading">
      <div class="loading-content">
        <i class="el-icon-loading"></i>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapConfigs } from "@/utils/mapUtils";
import MapboxLanguage from '@mapbox/mapbox-gl-language';
  import settings from "@/settings";

// 获取全局地图默认中心坐标
const defaultCenter = settings.mapConfig?.defaultCenter ;
export default {
  name: "MapboxMap",
  props: {
    center: {
      type: Array,
      default: () => defaultCenter, // 默认北京 [lng, lat]
    },
    zoom: {
      type: Number,
      default: 10,
    },
    mapClass: {
      type: String,
      default: "mapbox-map-container",
    },
    mapId: {
      type: String,
      default: "mapboxMap",
    },
    style: {
      type: String,
      default: "mapbox://styles/mapbox/outdoors-v12",


      //mapbox://styles/mapbox/streets-v12
      //mapbox://styles/mapbox/outdoors-v12
      //mapbox://styles/mapbox/light-v11
      //mapbox://styles/mapbox/dark-v11
      //mapbox://styles/mapbox/satellite-v9
      //mapbox://styles/mapbox/satellite-streets-v12
      //mapbox://styles/mapbox/navigation-day-v1
      //mapbox://styles/mapbox/navigation-night-v1
    },
    markers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      map: null,
      loading: true,
      markersOnMap: [], // 存储地图上的标记
      languageControl: null, // 存储语言控件实例
    };
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },
  watch: {
    center: {
      handler(newCenter) {
        if (this.map) {
          this.map.setCenter(newCenter);
        }
      },
      deep: true,
    },
    zoom(newZoom) {
      if (this.map) {
        this.map.setZoom(newZoom);
      }
    },
    markers: {
      handler(newMarkers) {
        this.updateMarkers(newMarkers);
      },
      deep: true,
    },
    '$i18n.locale'(newLocale) {
      this.updateMapLanguage(newLocale);
    },
  },
  methods: {
    initMap() {
      try {
        // 检查mapboxgl是否可用
        if (typeof window.mapboxgl === "undefined") {
          console.error("Mapbox GL JS 未加载");
          this.loading = false;
          this.$emit("map-error", new Error("Mapbox GL JS 未加载"));
          return;
        }

        // 设置 Mapbox 访问令牌
        window.mapboxgl.accessToken = mapConfigs.mapbox.accessToken;

        // 创建地图实例
        this.map = new window.mapboxgl.Map({
          container: this.mapId,
          style: this.style || mapConfigs.mapbox.style,
          center: this.center,
          zoom: this.zoom,
          antialias: true,
        });

        // 添加导航控件
        const nav = new window.mapboxgl.NavigationControl();
        this.map.addControl(nav, "top-right");

        // 添加比例尺控件
        const scale = new window.mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: "metric",
        });
        this.map.addControl(scale, "bottom-left");

        // 添加语言控件
        this.languageControl = new MapboxLanguage({
          defaultLanguage: this.getMapLanguage()
        });
        this.map.addControl(this.languageControl);

        // 地图加载完成事件
        this.map.on("load", () => {
          this.loading = false;
          this.$emit("map-init", this.map);
          this.updateMarkers(this.markers);
        });

        // 地图点击事件
        this.map.on("click", (e) => {
          this.$emit("map-click", {
            lngLat: e.lngLat,
            point: e.point,
            originalEvent: e.originalEvent,
          });
        });

        // 地图移动事件
        this.map.on("move", () => {
          this.$emit("map-move", {
            center: this.map.getCenter(),
            zoom: this.map.getZoom(),
          });
        });

        // 地图缩放事件
        this.map.on("zoom", () => {
          this.$emit("map-zoom", this.map.getZoom());
        });

        // 地图错误处理
        this.map.on("error", (error) => {
          console.error("Mapbox 地图错误:", error);
          this.loading = false;
          this.$emit("map-error", error);
        });
      } catch (error) {
        console.error("初始化 Mapbox 地图失败:", error);
        this.loading = false;
        this.$emit("map-error", error);
      }
    },

    // 更新标记点
    updateMarkers(markers) {
      if (!this.map || !this.map.isStyleLoaded()) return;

      // 清除现有标记
      this.clearMarkers();

      // 添加新标记
      markers.forEach((marker) => {
        this.addMarker(marker);
      });
    },

    // 添加标记点
    addMarker(markerData) {
      if (!this.map) return;

      const {
        position,
        popup,
        icon,
        draggable = false,
        visible = true,
      } = markerData;

      if (!position || !Array.isArray(position) || position.length < 2) {
        console.warn("无效的标记位置:", position);
        return;
      }

      // 创建标记元素
      const el = document.createElement("div");
      el.className = "mapbox-marker";

      if (icon) {
        if (typeof icon === "string") {
          el.style.backgroundImage = `url(${icon})`;
          el.style.backgroundSize = "cover";
          el.style.width = "32px";
          el.style.height = "32px";
        } else if (icon.url) {
          el.style.backgroundImage = `url(${icon.url})`;
          el.style.backgroundSize = "cover";
          el.style.width = icon.width ? `${icon.width}px` : "32px";
          el.style.height = icon.height ? `${icon.height}px` : "32px";
        }
      } else {
        // 默认标记样式
        el.className += " default-marker";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#ff0000";
        el.style.border = "2px solid #fff";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      }

      // 创建标记
      const marker = new window.mapboxgl.Marker({
        element: el,
        draggable: draggable,
      }).setLngLat(position);

      // 添加弹窗
      if (popup) {
        const popupInstance = new window.mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
        });

        if (typeof popup === "string") {
          popupInstance.setHTML(popup);
        } else if (popup.content) {
          popupInstance.setHTML(popup.content);
        }

        marker.setPopup(popupInstance);
      }

      // 添加到地图
      if (visible) {
        marker.addTo(this.map);
      }

      // 拖拽事件
      if (draggable) {
        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          this.$emit("marker-dragend", {
            marker: markerData,
            position: [lngLat.lng, lngLat.lat],
          });
        });
      }

      // 点击事件
      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation();
        this.$emit("marker-click", {
          marker: markerData,
          position: position,
        });
      });

      this.markersOnMap.push(marker);
    },

    // 清除所有标记
    clearMarkers() {
      this.markersOnMap.forEach((marker) => {
        marker.remove();
      });
      this.markersOnMap = [];
    },

    // 飞行到指定位置
    flyTo(center, zoom) {
      if (this.map) {
        this.map.flyTo({
          center: center,
          zoom: zoom || this.zoom,
          essential: true,
        });
      }
    },

    // 设置地图中心
    setCenter(center) {
      if (this.map) {
        this.map.setCenter(center);
      }
    },

    // 设置缩放级别
    setZoom(zoom) {
      if (this.map) {
        this.map.setZoom(zoom);
      }
    },

    // 获取地图实例
    getMap() {
      return this.map;
    },

    // 适应标记点
    fitBounds(markers) {
      if (!this.map || !markers || markers.length === 0) return;

      const bounds = new window.mapboxgl.LngLatBounds();

      markers.forEach((marker) => {
        if (marker.position && Array.isArray(marker.position)) {
          bounds.extend(marker.position);
        }
      });

      this.map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    },

    // 获取地图语言代码
    getMapLanguage() {
      const locale = this.$i18n?.locale || 'zh';
      // 将项目语言映射到 Mapbox 支持的语言代码
      const languageMap = {
        'zh': 'zh-Hans', // 简体中文
        'en': 'en',      // 英语
      };
      return languageMap[locale] || 'zh-Hans';
    },

    // 更新地图语言
    updateMapLanguage(locale) {
      if (!this.map || !this.languageControl) return;
      
      const mapLanguage = this.getMapLanguage();
      try {
        // 使用 setLanguage 方法切换语言
        this.languageControl.setLanguage(this.map, mapLanguage);
      } catch (error) {
        console.warn('切换地图语言失败:', error);
      }
    },
  },
};
</script>

<style scoped>
.mapbox-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.mapbox-map {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: #666;
}

.loading-content i {
  font-size: 24px;
  margin-bottom: 10px;
}

/* 默认标记样式 */
::v-deep .mapbox-marker {
  cursor: pointer;
}

::v-deep .mapbox-marker.default-marker:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Mapbox 控件样式调整 */
::v-deep .mapboxgl-ctrl-nav {
  background: rgba(255, 255, 255, 0.9);
}

::v-deep .mapboxgl-ctrl-scale {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
}
</style> 

<style>
/* 隐藏 Mapbox logo 和版权信息 */
.mapboxgl-ctrl-logo,
.mapboxgl-ctrl-attrib {
  display: none !important;
}
</style>
