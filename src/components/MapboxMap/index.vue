<template>
  <div class="mapbox-container">
    <div
      :id="mapId"
      :class="mapClass"
      class="mapbox-map"
      ref="mapContainer"
    ></div>

    <!-- Map loading status -->
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

// Get the default center coordinates of the global map
const defaultCenter = settings.mapConfig?.defaultCenter ;
export default {
  name: "MapboxMap",
  props: {
    center: {
      type: Array,
      default: () => defaultCenter, // Default center [lng, lat]
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
      markersOnMap: [], // Store map markers
      languageControl: null, // Store language control instance
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
        // Check if mapboxgl is available
        if (typeof window.mapboxgl === "undefined") {
          console.error("Mapbox GL JS not loaded");
          this.loading = false;
          this.$emit("map-error", new Error("Mapbox GL JS not loaded"));
          return;
        }

        // Set up a Mapbox access token
        window.mapboxgl.accessToken = mapConfigs.mapbox.accessToken;

        // Create a map instance
        this.map = new window.mapboxgl.Map({
          container: this.mapId,
          style: this.style || mapConfigs.mapbox.style,
          center: this.center,
          zoom: this.zoom,
          antialias: true,
        });

        // Add navigation controls
        const nav = new window.mapboxgl.NavigationControl();
        this.map.addControl(nav, "top-right");

        // Add scale bar control
        const scale = new window.mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: "metric",
        });
        this.map.addControl(scale, "bottom-left");

        // Add language control
        this.languageControl = new MapboxLanguage({
          defaultLanguage: this.getMapLanguage()
        });
        this.map.addControl(this.languageControl);

        // Map loading complete event
        this.map.on("load", () => {
          this.loading = false;
          this.$emit("map-init", this.map);
          this.updateMarkers(this.markers);
        });

        // Map click event
        this.map.on("click", (e) => {
          this.$emit("map-click", {
            lngLat: e.lngLat,
            point: e.point,
            originalEvent: e.originalEvent,
          });
        });

        // Map move event
        this.map.on("move", () => {
          this.$emit("map-move", {
            center: this.map.getCenter(),
            zoom: this.map.getZoom(),
          });
        });

        // Map zoom event
        this.map.on("zoom", () => {
          this.$emit("map-zoom", this.map.getZoom());
        });

        // Map error handling
        this.map.on("error", (error) => {
          console.error("Mapbox map error:", error);
          this.loading = false;
          this.$emit("map-error", error);
        });
      } catch (error) {
        console.error("Failed to initialize Mapbox map:", error);
        this.loading = false;
        this.$emit("map-error", error);
      }
    },

    // Update markers
    updateMarkers(markers) {
      if (!this.map || !this.map.isStyleLoaded()) return;

      // Clear existing tags
      this.clearMarkers();

      // Add new tag
      markers.forEach((marker) => {
        this.addMarker(marker);
      });
    },

    // Add markers
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
        console.warn("Invalid marker position:", position);
        return;
      }

      // Create markup elements
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
        // Default markup style
        el.className += " default-marker";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#ff0000";
        el.style.border = "2px solid #fff";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      }

      // Create tag
      const marker = new window.mapboxgl.Marker({
        element: el,
        draggable: draggable,
      }).setLngLat(position);

      // Add pop-up window
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

      // Add to map
      if (visible) {
        marker.addTo(this.map);
      }

      // drag event
      if (draggable) {
        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          this.$emit("marker-dragend", {
            marker: markerData,
            position: [lngLat.lng, lngLat.lat],
          });
        });
      }

      // click event
      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation();
        this.$emit("marker-click", {
          marker: markerData,
          position: position,
        });
      });

      this.markersOnMap.push(marker);
    },

    // Clear all marks
    clearMarkers() {
      this.markersOnMap.forEach((marker) => {
        marker.remove();
      });
      this.markersOnMap = [];
    },

    // Fly to a designated location
    flyTo(center, zoom) {
      if (this.map) {
        this.map.flyTo({
          center: center,
          zoom: zoom || this.zoom,
          essential: true,
        });
      }
    },

    // Set map center
    setCenter(center) {
      if (this.map) {
        this.map.setCenter(center);
      }
    },

    // Set zoom level
    setZoom(zoom) {
      if (this.map) {
        this.map.setZoom(zoom);
      }
    },

    // Get map instance
    getMap() {
      return this.map;
    },

    // Adapt to marker points
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

    // Get map language code
    getMapLanguage() {
      const locale = this.$i18n?.locale || 'en';
      const languageMap = {
        'zh': 'zh-Hans',
        'en': 'en',
      };
      return languageMap[locale] || 'en';
    },

    // Update map language
    updateMapLanguage(locale) {
      if (!this.map || !this.languageControl) return;
      
      const mapLanguage = this.getMapLanguage();
      try {
        // Use the setLanguage method to switch languages
        this.languageControl.setLanguage(this.map, mapLanguage);
      } catch (error) {
        console.warn('Failed to switch map language:', error);
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

/* Default marker style */
::v-deep .mapbox-marker {
  cursor: pointer;
}

::v-deep .mapbox-marker.default-marker:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Mapbox control styles */
::v-deep .mapboxgl-ctrl-nav {
  background: rgba(255, 255, 255, 0.9);
}

::v-deep .mapboxgl-ctrl-scale {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
}
</style> 

<style>
/* Hide Mapbox logo and copyright */
.mapboxgl-ctrl-logo,
.mapboxgl-ctrl-attrib {
  display: none !important;
}
</style>
