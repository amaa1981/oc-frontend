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
    // Is it possible to click to update annotations?
    cilckable: {
      type: Boolean,
      default: false
    },
    // Search keywords
    keyword: {
      type: String
    },
    // Label points
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
    // Monitor Search keywords
    keyword: {
      handler(newVal) {
        if (newVal !== '') {
          this.$nextTick(() => {
            if (this.map === null) {
              this.initMap();
            }
            // Set search parameters
            const request = {
              query: newVal,
              fields: ["name", "geometry", "placr_id"],
            };
            // Conduct a location search
            this.service.textSearch(request, (results, status) => {
              if (status === this.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                // Use the first search result
                const place = results[0];
                const location = place.geometry.location;
                // Set map center to search results
                this.map.setCenter(location);
              }
            });
          })
        }
      }
    },
    // Monitor new marking point information
    position: {
      handler(newVal) {
        this.$nextTick(() => {
          // Remove old tags before adding new ones
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
          // Set the center of the map to where the label point is
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
    // Map initialization
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
          // mark
          this.marker = new google.maps.Marker({
            position: this.position,
            map: this.map,
            title: "My Location",
            // draggable:true, // Whether it can be moved
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
      // Remove old tags before adding new ones
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
