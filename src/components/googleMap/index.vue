<template>
  <div id="map" />
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader"
const loader = new Loader({
  apiKey: "AIzaSyAFE09Wd75el2zfE-VVNOkqmti66abP8zo", // API key
  version: "weekly", // Version
  libraries: ["places"],
})
export default {
  props: {
    // 是否可点击更新标注
    cilckable: {
      type: Boolean,
      default: false
    },
    // 搜索关键字
    keyword: {
      type: String
    },
    // 标注点
    position: {
      type: Object,
      default: () => ({ lat: 37.7749, lng: -122.4194 })
    },
  },
  data() {
    return {
      google: null,
      map: null,
      service: null,
      marker: null
    }
  },
  watch: {
    // 监听搜索关键字
    keyword: {
      handler(newVal) {
        if (newVal !== '') {
          this.$nextTick(() => {
            if (this.map === null) {
              this.initMap();
            }
            // 设置搜索参数
            const request = {
              query: newVal,
              fields: ["name", "geometry", "placr_id"],
            };
            // 进行地点搜索
            this.service.textSearch(request, (results, status) => {
              if (status === this.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                // 使用第一个搜索结果
                const place = results[0];
                const location = place.geometry.location;
                // 将地图中心设置为搜索结果
                this.map.setCenter(location);
              }
            });
          })
        }
      }
    },
    // 监听新的标注点信息
    position: {
      handler(newVal) {
        this.$nextTick(() => {
          // 在添加新标记前先移除旧标记
          if (this.map === null) {
            this.initMap();
          }
          this.marker.setMap(null);
          this.marker = new google.maps.Marker({
            position: newVal,
            map: this.map,
            title: "My Location",
            animation: google.maps.Animation.BOUNCE
          });
          // 设置地图的中心为标注点所在
          this.map.setCenter(this.marker.getPosition());
        })
      },
      deep: true
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // 地图初始化
    initMap() {
      const mapOptions = {
        center: this.position, // Default map center at marker location
        zoom: 12,
        panControl: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false, // Street view
        overviewMapControl: true,
        rotateControl: true
      }
      loader
        .load()
        .then((google) => {
          this.google = google
          this.map = new google.maps.Map(
            document.getElementById("map"),
            mapOptions
          )
          // 标记
          this.marker = new google.maps.Marker({
            position: this.position,
            map: this.map,
            title: "My Location",
            // draggable:true, // 是否可移动
            animation: google.maps.Animation.BOUNCE  // BOUNCE: always bouncing, DROP: bounce after move
          }) // Map marker class
          if (this.cilckable) {
            this.google.maps.event.addListener(this.map, 'click', this.clickMap) // Listen to map click events
          }
          this.service = new google.maps.places.PlacesService(this.map); // Create places search service
        }).catch((e) => {
          console.log(e)
        })
    },
    clickMap(e) {
      let lat = e.latLng.lat();
      let lng = e.latLng.lng();
      // 在添加新标记前先移除旧标记
      this.marker.setMap(null);
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: "My Location",
        animation: google.maps.Animation.BOUNCE
      })
      this.$emit('setMarker', {
        point: {
          lng,
          lat
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
