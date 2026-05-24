/**
 * Map utility class - supports multiple map services
 */

const PI = Math.PI;
const AXIS = 6378245.0;       // Krasovsky ellipsoid semi-major axis
const OFFSET = 0.00669342162296594323; // First eccentricity squared of the ellipsoid

/**
 * Check whether coordinates are within mainland China (GCJ02 offset applies)
 * @param {number} lng Longitude
 * @param {number} lat Latitude
 * @returns {boolean}
 */
export function isInChina(lng, lat) {
  const chinaBox = {
    minLng: 73.66,
    maxLng: 135.05,
    minLat: 3.86,
    maxLat: 53.55,
  };
  return (
    lng >= chinaBox.minLng &&
    lng <= chinaBox.maxLng &&
    lat >= chinaBox.minLat &&
    lat <= chinaBox.maxLat
  );
}

/**
 * Get the recommended map service
 * @returns {string}
 */
export function getRecommendedMapService() {
  return 'mapbox';
}

// Map service configuration - all keys are read from environment variables, never hardcode them
export const mapConfigs = {
  mapbox: {
    name: 'Mapbox GL JS',
    mapboxToken: process.env.VUE_APP_MAPBOX_TOKEN,
    accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
    style: 'mapbox://styles/mapbox/dark-v11', // Options: dark-v11, light-v11, streets-v12, satellite-v9, outdoors-v12
    coverage: 'global',
    features: ['navigation', 'poi', 'traffic', 'markers', 'popups', '3d'],
  },
  amap: {
    name: "AMap (AMAP)",
    key: process.env.VUE_APP_AMAP_KEY,
    securityJsCode: process.env.VUE_APP_AMAP_SECURITY_CODE,
    coverage: 'china',
    features: ['navigation', 'poi', 'traffic'],
  },
  google: {
    name: 'Google Maps',
    key: process.env.VUE_APP_GOOGLE_MAPS_KEY,
    coverage: 'global',
    features: ['navigation', 'poi', 'traffic', 'streetview'],
  },
  osm: {
    name: 'OpenStreetMap',
    coverage: 'global',
    features: ['basic_map'],
  },
};

// ─── Coordinate Conversion Utilities ─────────────────────────────────────────

function _transformLat(lng, lat) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat +
    0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320.0 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function _transformLng(lng, lat) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng +
    0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret;
}

/**
 * Coordinate system conversion utilities
 */
export const coordinateConverter = {
  /**
   * WGS84 → GCJ02 (AMap / Tencent Maps coordinate system)
   * @param {number} lng Longitude
   * @param {number} lat Latitude
   * @returns {[number, number]} [lng, lat]
   */
  wgs84ToGcj02(lng, lat) {
    if (!isInChina(lng, lat)) return [lng, lat];

    let dLat = _transformLat(lng - 105.0, lat - 35.0);
    let dLng = _transformLng(lng - 105.0, lat - 35.0);

    const radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - OFFSET * magic * magic;
    const sqrtMagic = Math.sqrt(magic);

    dLat = (dLat * 180.0) / ((AXIS * (1 - OFFSET)) / (magic * sqrtMagic) * PI);
    dLng = (dLng * 180.0) / (AXIS / sqrtMagic * Math.cos(radLat) * PI);

    return [lng + dLng, lat + dLat];
  },

  /**
   * GCJ02 → WGS84
   * @param {number} lng Longitude
   * @param {number} lat Latitude
   * @returns {[number, number]} [lng, lat]
   */
  gcj02ToWgs84(lng, lat) {
    if (!isInChina(lng, lat)) return [lng, lat];

    let dLat = _transformLat(lng - 105.0, lat - 35.0);
    let dLng = _transformLng(lng - 105.0, lat - 35.0);

    const radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - OFFSET * magic * magic;
    const sqrtMagic = Math.sqrt(magic);

    dLat = (dLat * 180.0) / ((AXIS * (1 - OFFSET)) / (magic * sqrtMagic) * PI);
    dLng = (dLng * 180.0) / (AXIS / sqrtMagic * Math.cos(radLat) * PI);

    return [lng - dLng, lat - dLat];
  },
};

export default {
  isInChina,
  getRecommendedMapService,
  mapConfigs,
  coordinateConverter,
};