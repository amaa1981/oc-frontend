<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item :label="$t('device.deviceName')" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          :placeholder="$t('commonTips.pleaseEnter')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item :label="$t('device.deviceType')" prop="deviceType">
        <el-select
          v-model="queryParams.deviceType"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
        >
          <el-option
            v-for="dict in dict.type.v1_device_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('device.factoryType')" prop="factoryType">
        <el-select
          v-model="queryParams.factoryType"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
        >
          <el-option
            v-for="dict in dict.type.v1_manufacturer_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('device.protocolType')" prop="protocolType">
        <el-select
          v-model="queryParams.protocolType"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
        >
          <el-option
            v-for="dict in dict.type.v1_streaming_protocol"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('device.installationArea')"
        prop="installationArea"
      >
        <el-select
          v-model="queryParams.installationArea"
          :placeholder="$t('commonTips.pleaseSelect')"
          clearable
        >
          <el-option
            v-for="dict in dict.type.v1_device_area"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >{{ $t("commonBtn.search") }}</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
          $t("commonBtn.reset")
        }}</el-button>
      </el-form-item>
      <el-form-item class="form-actions-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:device:add']"
          >{{ $t("commonBtn.add") }}</el-button
        >
        <!-- <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:device:remove']"
          >{{ $t("commonBtn.remove") }}</el-button
        >
        <el-button
          type="default"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:device:edit']"
          >{{ $t("commonBtn.edit") }}</el-button
        > -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deviceList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->

      <el-table-column
        :label="$t('device.image')"
        align="center"
        prop="image"
        width="100"
      >
        <template slot-scope="scope">
          <i class="el-icon-video-camera" style="font-size:32px;color:#26a69a;"></i>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('device.deviceName')"
        align="center"
        prop="deviceName"
      />
      <el-table-column
        :label="$t('device.deviceType')"
        align="center"
        prop="deviceType"
      >
        <template slot-scope="scope">
          {{ $t("dict.v1_device_type." + scope.row.deviceType) }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('device.installationArea')"
        align="center"
        prop="installationArea"
      >
        <template slot-scope="scope">
          <span v-if="edition === 'standard'">{{ getDeptName(scope.row.installationArea) }}</span>
          <dict-tag
            v-else
            :options="dict.type.v1_device_area"
            :value="scope.row.installationArea"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('device.installationLocation')"
        align="center"
        prop="installationLocation"
      />

      <el-table-column
        :label="$t('device.status')"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === '1' || scope.row.status === 'online'" class="device-status device-status--online">
            <i class="status-dot" />Online
          </span>
          <span v-else class="device-status device-status--offline">
            <i class="status-dot" />Offline
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('device.operate')"
        align="center"
        class-name="small-padding fixed-width"
        width="260px"
      >
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            class="btn-view"
            @click="handleAiSettings(scope.row)"
            >AI Settings</el-button
          >
          <span class="action-divider" />
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            class="btn-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:device:edit']"
            >{{ $t("commonBtn.edit") }}</el-button
          >
          <span class="action-divider" />
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="btn-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:device:remove']"
            >{{ $t("commonBtn.remove") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- Add or Edit device information dialog box -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="560px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <!-- Device name - full width -->
        <el-form-item :label="$t('device.deviceName')" prop="deviceName">
          <el-input
            v-model="form.deviceName"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>

        <!-- Device type + vendor type -->
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="$t('device.deviceType')" prop="deviceType">
              <el-select
                v-model="form.deviceType"
                :placeholder="$t('commonTips.pleaseSelect')"
                style="width:100%"
              >
                <el-option
                  v-for="dict in dict.type.v1_device_type"
                  :key="dict.value"
                  :label="$t('dict.v1_device_type.' + dict.value)"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('device.factoryType')" prop="factoryType">
              <el-select
                v-model="form.factoryType"
                :placeholder="$t('commonTips.pleaseSelect')"
                :disabled="disabled"
                style="width:100%"
              >
                <el-option
                  v-for="dict in dict.type.v1_manufacturer_type"
                  :key="dict.value"
                  :label="$t('dict.v1_manufacturer_type.' + dict.value)"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Protocol type + device area -->
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="$t('device.protocolType')" prop="protocolType">
              <el-select
                v-model="form.protocolType"
                :placeholder="$t('commonTips.pleaseSelect')"
                :disabled="disabled"
                style="width:100%"
              >
                <el-option
                  v-for="dict in dict.type.v1_streaming_protocol"
                  :key="dict.value"
                  :label="$t('dict.v1_streaming_protocol.' + dict.value)"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('device.installationArea')" prop="installationArea">
              <!-- Standard edition: tree selector -->
              <treeselect
                v-if="edition === 'standard'"
                v-model="form.installationArea"
                :options="deptOptions"
                :show-count="true"
                :placeholder="$t('commonTips.pleaseSelect')"
              />
              <!-- Saudi edition: dictionary select -->
              <el-select
                v-else
                v-model="form.installationArea"
                :placeholder="$t('commonTips.pleaseSelect')"
                style="width:100%"
              >
                <el-option
                  v-for="dict in dict.type.v1_device_area"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Installation Location — full width -->
        <el-form-item :label="$t('device.installationLocation')" prop="installationLocation">
          <el-input
            v-model="form.installationLocation"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>

        <!-- IP + Port -->
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="IP" prop="deviceIp">
              <el-input
                v-model="form.deviceIp"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Port" prop="devicePort">
              <el-input
                v-model="form.devicePort"
                :placeholder="$t('commonTips.pleaseEnter')"
                type="number"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Username + Password -->
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="$t('device.userName')" prop="userName">
              <el-input
                v-model="form.userName"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('device.password')" prop="password">
              <el-input
                v-model="form.password"
                :placeholder="$t('commonTips.pleaseEnter')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Fields displayed by nvr -->
        <el-form-item
          :label="$t('device.deviceChannel')"
          prop="deviceChannel"
          v-if="form.deviceType == 2"
        >
          <el-input
            v-model="form.deviceChannel"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>

        <!-- Fields that rtsp needs to display -->
        <template
          v-if="
            form.protocolType == 7 ||
            form.protocolType == 11 ||
            form.protocolType == 12
          "
        >
          <el-form-item :label="$t('device.rtspMain')" prop="rtspMain">
            <el-input
              v-model="form.rtspMain"
              :placeholder="$t('commonTips.pleaseEnter')"
            />
          </el-form-item>
          <el-form-item :label="$t('device.rtspSub')" prop="rtspSub">
            <el-input
              v-model="form.rtspSub"
              :placeholder="$t('commonTips.pleaseEnter')"
            />
          </el-form-item>
        </template>

        <!-- Coordinates - full width -->
        <el-form-item :label="$t('device.coordinate')" prop="coordinate">
          <div class="coordinate-row">
            <el-input
              v-model="form.coordinate"
              :placeholder="$t('commonTips.pleaseEnter')"
            />
            <button type="button" class="locate-btn" @click="positioning">
              <i class="el-icon-location-outline" />
              {{ $t("device.setter") }}
            </button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{
          $t("commonBtn.confirm")
        }}</el-button>
        <el-button @click="cancel">{{ $t("commonBtn.cancel") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('device.search')"
      :visible.sync="dialogMap"
      width="60%"
      :destroy-on-close="true"
      v-if="sign"
      @opened="handleDialogOpened"
    >
      <div class="location-box">
        <template>
          <el-input
            v-model="keyword"
            :placeholder="$t('commonTips.pleaseEnter')"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="setView"
            ></el-button>
          </el-input>

          <!-- Mapbox map -->
          <mapbox-map
            v-if="dialogMap && mapReady"
            :center="amapCenter"
            :zoom="zoom"
            :markers="deviceMarkers"
            map-id="deviceMapbox"
            map-class="device-mapbox"
            @map-init="onDeviceMapInit"
            @map-click="onDeviceMapClick"
            @marker-dragend="onMarkerDragEnd"
            ref="deviceMap"
          ></mapbox-map>

          <!-- Map loading prompt -->
          <div
            v-else-if="dialogMap && !mapReady"
            class="map-loading-placeholder"
          >
            <i class="el-icon-loading"></i>
            <span>loading...</span>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setok" size="mini">{{
          $t("commonBtn.confirm")
        }}</el-button>
      </span>
    </el-dialog>

    <!-- AI Settings Dialog -->
    <el-dialog
      title="AI Detection Settings"
      :visible.sync="aiSettingsOpen"
      width="480px"
      append-to-body
    >
      <div v-if="aiSettingsDevice" style="padding:10px">
        <h4 style="margin-bottom:20px;color:#26a69a">{{ aiSettingsDevice.deviceName }}</h4>
        
        <el-form label-position="top">
          <el-form-item label="Confidence Threshold (0.1 - 1.0)">
            <el-slider v-model="aiSettings.confidence" :min="0.1" :max="1.0" :step="0.05" show-input />
            <div style="color:#909399;font-size:12px;margin-top:4px">Higher = fewer but more accurate detections. Recommended: 0.65</div>
          </el-form-item>

          <el-form-item label="IOU Threshold (0.1 - 0.9)">
            <el-slider v-model="aiSettings.iouThreshold" :min="0.1" :max="0.9" :step="0.05" show-input />
            <div style="color:#909399;font-size:12px;margin-top:4px">Controls overlapping boxes. Lower = fewer duplicates. Recommended: 0.4</div>
          </el-form-item>

          <el-form-item label="Scan Interval (seconds)">
            <el-input-number v-model="aiSettings.processInterval" :min="1" :max="60" :step="1" style="width:100%" />
            <div style="color:#909399;font-size:12px;margin-top:4px">How often to run detection. Lower = more CPU usage.</div>
          </el-form-item>

          <el-form-item label="Alert Cooldown (seconds)">
            <el-input-number v-model="aiSettings.cooldown" :min="5" :max="300" :step="5" style="width:100%" />
            <div style="color:#909399;font-size:12px;margin-top:4px">Minimum time between alerts for the same violation.</div>
          </el-form-item>

          <el-form-item label="Enable Violations">
            <el-checkbox v-model="aiSettings.detectMask">No Mask Detection</el-checkbox><br/>
            <el-checkbox v-model="aiSettings.detectHairnet">No Hairnet Detection</el-checkbox><br/>
            <el-checkbox v-model="aiSettings.detectGlove">No Glove Detection</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="saveAiSettings">Save</el-button>
        <el-button @click="aiSettingsOpen = false">Cancel</el-button>
      </div>
    </el-dialog>

    <!-- Monitor pop-up window components -->
    <el-dialog
      :title="$t('device.monitor')"
      :visible.sync="dialogPlayer"
      width="60%"
      :destroy-on-close="true"
      v-if="dialogPlayer"
    >
      <div class="player-box">
        <player :config="playerInfo" :fullscreen="fullscreen"></player>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPlayer = false" size="mini">{{
          $t("commonBtn.close")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapConfig } from "../../../settings.js";

import {
  listDevice,
  getDevice,
  delDevice,
  addDevice,
  updateDevice,
} from "@/api/system/device";
import player from "@/components/Player/player.vue";
import MapboxMap from "@/components/MapboxMap/index.vue";
  import settings from "@/settings";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { deptTreeSelect } from "@/api/system/user";

// Get the default center coordinates of the global map
const defaultCenter = settings.mapConfig?.defaultCenter ;
export default {
  name: "Device",
  dicts: [
    "v1_device_area",
    "v1_manufacturer_type",
    "v1_device_type",
    "v1_device_status",
    "v1_streaming_protocol",
  ],
  components: {
    player,
    MapboxMap,
    Treeselect,
  },
  data() {
    return {
      // Loading state
      loading: true,
      // Selected ids
      ids: [],
      // Disable single-action
      single: true,
      // Disable batch-action
      multiple: true,
      // Show search conditions
      showSearch: true,
      // Total count
      total: 0,
      // Device information table data
      deviceList: [],
      // Popup layer Title
      title: "",
      // Dialog visible
      open: false,
      // Department Tree Options (for standard version)
      deptOptions: [],
      // Edition type
      edition: settings.edition || 'saudi',
      // Query parameters
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceId: null,
        deviceName: null,
        deviceType: null,
        status: null,
        factoryType: null,
        protocolType: null,
        installationArea: localStorage.getItem('installationArea') || null,
      },
      // Form parameters
      form: {},
      disabled: false,
      // Form verification
      rules: {
        deviceName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        deviceType: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        factoryType: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        protocolType: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        installationArea: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "change",
          },
        ],
        installationLocation: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        deviceIp: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        devicePort: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        userName: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        deviceChannel: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        cameraIndexCode: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        rtspMain: [],
        rtspSub: [],
        coordinate: [],
      },

      aiSettingsOpen: false,
      aiSettingsDevice: null,
      aiSettings: {
        confidence: 0.65,
        iouThreshold: 0.4,
        cooldown: 10,
        processInterval: 10,
        refreshInterval: 30,
        detectMask: true,
        detectHairnet: true,
        detectGlove: true,
      },
      aiSettingsMap: {},
      refreshTimer: null,
      dialogMap: false, // Control dialog
      center: { lng: 0, lat: 0 }, // Center coords (compatibility)
      position: { lng: 0, lat: 0 }, // Selected coords (compatibility)
      zoom: 14, // Zoom level
      sign: false, // Dialog toggle
      keyword: "",
      dialogPlayer: false, // Monitor dialog
      playerInfo: {
        rtspUrl: "",
        videoId: "",
      },
      fullscreen: false, // Monitor dialog fullscreen
      select: mapConfig.mapType, // Map type
      map: null,
      // Mapbox map related configuration
      amapCenter: defaultCenter, // Map center [lng, lat]
      deviceMarkers: [], // Device marker array
      mapReady: false, // Map ready state
    };
  },
  watch: {
    "form.deviceIp"() {
      this.changertsp();
    },
    "form.devicePort"() {
      this.changertsp();
    },
    "form.password"() {
      this.changertsp();
    },
    "form.userName"() {
      this.changertsp();
    },
    "form.deviceChannel"() {
      this.changertsp();
    },
    "form.protocolType"() {
      this.changertsp();
    },
    "form.factoryType"() {
      this.changertsp();
    },
  },
  created() {
    if (this.edition === 'standard') {
      this.getDeptTree().then(() => {
        this.getList()
      })
    } else {
      this.getList()
    }
    // Monitor device area changes
    this.$bus.$on('installationAreaChange', this.onInstallationAreaChange)
  },
  beforeDestroy() {
    // Remove listening
    this.$bus.$off('installationAreaChange', this.onInstallationAreaChange);
  },
  mounted() {
    this.refreshTimer = setInterval(() => {
      this.getList();
    }, 10000); // refresh every 10 seconds
  },
  methods: {
    // Device area change processing
    onInstallationAreaChange(val) {
      this.queryParams.installationArea = val || null;
      this.handleQuery();
    },
    // Get department tree (standard version)
    getDeptTree() {
      return deptTreeSelect().then((response) => {
        this.deptOptions = response.data
      })
    },
    // Get the name based on the department ID (standard version List display)
    getDeptName(id) {
      if (!id || !this.deptOptions.length) return id
      const find = (list) => {
        for (const item of list) {
          if (String(item.id) === String(id)) return item.label
          if (item.children) {
            const r = find(item.children)
            if (r) return r
          }
        }
        return null
      }
      return find(this.deptOptions) || id
    },
    // Mapbox map event handling
    onDeviceMapInit(map) {
      console.log("Device Mapbox map initialized", map);
      this.map = map;
      this.updateDeviceMarkers();
    },

    onDeviceMapClick(e) {
      console.log("Device map click event", e);
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      this.position.lng = lng;
      this.position.lat = lat;
      this.form.coordinate = lng + "," + lat;

      // Update device tag location
      this.updateDeviceMarkers([lng, lat]);
    },

    onMarkerDragEnd(e) {
      console.log("Marker drag end event", e);
      const lng = e.position[0];
      const lat = e.position[1];

      this.position.lng = lng;
      this.position.lat = lat;
      this.form.coordinate = lng + "," + lat;

      // Update marker position
      this.updateDeviceMarkers([lng, lat]);
    },

    // Update device points
    updateDeviceMarkers(position = null) {
      const currentPosition = position || this.amapCenter;
      this.deviceMarkers = [
        {
          id: "device-marker",
          position: currentPosition,
          visible: true,
          draggable: true,
          popup: `
          <div style="padding: 10px;">
            <h4>Device Location</h4>
            <p><strong>Longitude:</strong> ${currentPosition[0].toFixed(6)}</p>
            <p><strong>Latitude:</strong> ${currentPosition[1].toFixed(6)}</p>
          </div>
        `,
        },
      ];
    },
    //Search location based on name (using Mapbox Geocoding API)
    async setView() {
      if (!this.keyword || !this.map) {
        this.$message.warning("Please enter search keywords");
        return;
      }

      try {
        // Use Mapbox Geocoding API to conduct place name search
        const mapboxToken = process.env.VUE_APP_MAPBOX_TOKEN || this.$store.state.settings.mapboxToken
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            this.keyword
          )}.json?access_token=${mapboxToken}&country=CN&language=zh-CN&limit=1`
        );

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const location = feature.center; // [lng, lat]

          // Update map center and marker location
          this.amapCenter = location;
          this.position.lng = location[0];
          this.position.lat = location[1];
          this.form.coordinate = location[0] + "," + location[1];

          // Move map to Search location
          this.map.flyTo({
            center: location,
            zoom: 16,
            essential: true,
          });

          // Update markers
          this.updateDeviceMarkers(location);

          this.$message.success(`Found: ${feature.place_name}`);
        } else {
          this.$message.error("No address found");
        }
      } catch (error) {
        console.error("Error searching address:", error);
        this.$message.error("Address search failed, please try again");
      }
    },
    //Splice rtsp path
    changertsp() {
      console.log(this.form);

      let rtspurl = "";

      //Hikvision old private agreement
      if (this.form.factoryType == 1) {
        rtspurl =
          "rtsp://" +
          this.form.userName +
          ":" +
          this.form.password +
          "@" +
          this.form.deviceIp +
          ":" +
          this.form.devicePort +
          "/h264/ch" +
          this.form.deviceChannel +
          "/main/av_stream";

        this.form.rtspMain = rtspurl + "/main/av_stream";
        this.form.rtspSub = rtspurl + "/sub/av_stream";
      }

      if (this.form.factoryType == 10) {
        rtspurl =
          "rtsp://" +
          this.form.userName +
          ":" +
          this.form.password +
          "@" +
          this.form.deviceIp +
          ":" +
          this.form.devicePort +
          "/Streaming/Channels/" +
          this.form.deviceChannel +
          "0";

        this.form.rtspMain = rtspurl + "1";
        this.form.rtspSub = rtspurl + "2";
      }
      //Dahua
      if (this.form.factoryType == 5) {
        rtspurl =
          "rtsp://" +
          this.form.userName +
          ":" +
          this.form.password +
          "@" +
          this.form.deviceIp +
          ":" +
          this.form.devicePort +
          "/cam/realmonitor?channel=" +
          this.form.deviceChannel +
          "&subtype=0";

        this.form.rtspMain = rtspurl + "0";
        this.form.rtspSub = rtspurl + "1";
      }
    },
    changemap() {
      console.log(this.select);
    },
    //Jump to setup task
    handleAiSettings(row) {
      this.aiSettingsDevice = row;
      const saved = this.aiSettingsMap[row.id];
      if (saved) {
        this.aiSettings = { ...saved };
      } else {
        this.aiSettings = {
          confidence: 0.5,
          cooldown: 10,
          refreshInterval: 30,
          detectMask: true,
          detectHairnet: true,
          detectGlove: true,
        };
      }
      this.aiSettingsOpen = true;
    },
    saveAiSettings() {
      const deviceId = this.aiSettingsDevice.id;
      this.aiSettingsMap[deviceId] = { ...this.aiSettings };
      localStorage.setItem('aiSettings_' + deviceId, JSON.stringify(this.aiSettings));
      // Save to backend
      this.$axios ? 
        this.$axios.post(`/api/device/${deviceId}/ai-settings`, this.aiSettings) :
        this.$http ? this.$http.post(`/api/device/${deviceId}/ai-settings`, this.aiSettings) :
        fetch(`/api/device/${deviceId}/ai-settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.aiSettings)
        });
      this.$message.success('AI settings saved for ' + this.aiSettingsDevice.deviceName);
      this.aiSettingsOpen = false;
    },
    loadAiSettings(deviceId) {
      const saved = localStorage.getItem('aiSettings_' + deviceId);
      if (saved) {
        this.aiSettingsMap[deviceId] = JSON.parse(saved);
      }
    },
    getTask(row) {
      this.$message.info("Device: " + (row.deviceName || row.name) + " | IP: " + (row.deviceIp || "N/A") + " | RTSP: " + (row.rtspMain || "N/A"));
    },
    //Confirm coordinates
    setok() {
      this.dialogMap = false;
      this.sign = false;
      this.mapReady = false;
      // Clean up map instance references
      this.map = null;
      console.log("Map dialog closed; state reset");
    },
    //Map click event
    handleMapClick(e) {
      console.log(e.lnglat);
      const lng = e.lnglat.lng;
      const lat = e.lnglat.lat;

      this.position.lng = lng;
      this.position.lat = lat;
      this.form.coordinate = lng + "," + lat;

      // Update marker position
      this.markerPosition = [lng, lat];
    },
    //Marker drag end event
    handleMarkerDragEnd(e) {
      console.log(e.lnglat);
      const lng = e.lnglat.lng;
      const lat = e.lnglat.lat;

      this.position.lng = lng;
      this.position.lat = lat;
      this.form.coordinate = lng + "," + lat;

      // Update marker position
      this.markerPosition = [lng, lat];
    },
    //Show map
    positioning() {
      console.log("ok");
      console.log(this.form.coordinate);
      this.sign = true;
      setTimeout(() => {
        // Reset map status
        this.mapReady = false;
        this.map = null;

        this.dialogMap = true;
        //longitude and latitude
        if (this.form.coordinate == "" || this.form.coordinate == null) {
          this.center.lng = defaultCenter[0];
          this.center.lat = defaultCenter[1];
          this.position.lng = defaultCenter[0];
          this.position.lat = defaultCenter[1];
          this.amapCenter = defaultCenter;
          this.markerPosition =defaultCenter;
        } else {
          this.center.lng = Number(this.form.coordinate.split(",")[0]);
          this.center.lat = Number(this.form.coordinate.split(",")[1]);
          this.position.lng = Number(this.form.coordinate.split(",")[0]);
          this.position.lat = Number(this.form.coordinate.split(",")[1]);
          this.amapCenter = [
            Number(this.form.coordinate.split(",")[0]),
            Number(this.form.coordinate.split(",")[1]),
          ];
          this.markerPosition = [
            Number(this.form.coordinate.split(",")[0]),
            Number(this.form.coordinate.split(",")[1]),
          ];
        }
        console.log(this.center);
      }, 1000);
    },
    /** Query device list */
    getList() {
      this.loading = true;
      listDevice(this.queryParams).then((response) => {
        this.deviceList = response.data.records;
        this.total = response.data.totalCount;
        this.loading = false;
      });
    },
    // Cancel
    cancel() {
      this.open = false;
      this.reset();
    },
    // FormReset
    reset() {
      this.form = {
        id: null,
        deviceId: null,
        deviceName: null,
        deviceType: null,
        status: null,
        factoryType: null,
        protocolType: null,
        installationArea: null,
        installationLocation: null,
        deviceIp: null,
        devicePort: "554",
        userName: null,
        password: null,
        coordinate: null,
        deviceChannel: 1,
        cameraIndexCode: null,
        rtspMain: null,
        rtspSub: null,
        createTime: null,
        updateTime: null,
        createId: null,
        updateId: null,
        createBy: null,
        updateBy: null,
        isDelete: null,
      };
      this.resetForm("form");
    },
    /** Search handler */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** Reset handler */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // Selection change
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** Add handler */
    handleAdd() {
      this.disabled = false;
      this.reset();
      this.open = true;
      this.title = this.$t("device.dialogTitle_a");
    },
    /** Edit handler */
    handleUpdate(row) {
      this.disabled = true;
      this.reset();
      const id = row.id || this.ids;
      getDevice(id).then((response) => {
        this.form = JSON.parse(JSON.stringify(response.data));
        this.open = true;
        this.title = this.$t("device.dialogTitle_e");
        setTimeout(() => {
          this.form.rtspMain = response.data.rtspMain;
          this.form.rtspSub = response.data.rtspSub;
        }, 500);
      });
    },
    /** Submit handler */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDevice(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.edit_s"));
              this.open = false;
              this.getList();
            });
          } else {
            addDevice(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t("commonTips.add_s"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    /** Delete handler */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm(this.$t("device.confirmRemove", { ids: ids }))
        .then(function () {
          return delDevice(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("commonTips.remove_s"));
        })
        .catch(() => {});
    },
    /** Export handler */
    handleExport() {
      this.download(
        "system/device/export",
        {
          ...this.queryParams,
        },
        `device_${new Date().getTime()}.xlsx`
      );
    },
    // Triggered when the pop-up window opens, used to ensure that the map instance has been created
    handleDialogOpened() {
      this.mapReady = true;
      // Delay ensures map initializes correctly
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.map) {
            this.map.resize(); // Mapbox needs resize call
            this.map.flyTo({
              center: this.amapCenter,
              zoom: this.zoom,
              essential: true,
            });
          }
        }, 500);
      });
    },
  },
  beforeDestroy() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  },
};
</script>
<style>
.el-dialog .location-box .el-select {
  width: 100px;
}
.device-amap {
  height: 600px;
  width: 100%;
  min-height: 500px;
}
.location-box {
  height: 650px;
}
.map-loading-placeholder {
  height: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #909399;
  font-size: 14px;
}
.map-loading-placeholder i {
  font-size: 24px;
  margin-bottom: 10px;
  animation: rotating 2s linear infinite;
}
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
.player-box {
  width: 100%;
  height: 50vh;
}
.isFullscreen {
  width: 100vw;
  height: 100vh;
}
</style>

<style lang="scss" scoped>
// Online/offline status capsule
.device-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid;

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &--online {
    color: #0abf8a;
    background: #e6faf4;
    border-color: #b3edd9;

    .status-dot {
      background: #0abf8a;
    }
  }

  &--offline {
    color: #f05252;
    background: #fef2f2;
    border-color: #fecaca;

    .status-dot {
      background: #f05252;
    }
  }
}

// Coordinate row
.coordinate-row {
  display: flex;
  gap: 10px;
  align-items: center;

  .el-input {
    flex: 1;
  }
}

.locate-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 18px;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid #29908d;
  background: #f0fafa;
  color: #29908d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, box-shadow 0.2s;

  i {
    font-size: 16px;
  }

  &:hover {
    background: #e0f5f4;
    box-shadow: 0 0 0 2px rgba(41, 144, 141, 0.15);
  }

  &:active {
    background: #c8eeec;
  }
}

// Action column button color
.btn-view {
  color: #0abf8a !important;
  &:hover { color: #059669 !important; }
}

.btn-edit {
  color: #3b82f6 !important;
  &:hover { color: #2563eb !important; }
}

.btn-delete {
  color: #f05252 !important;
  &:hover { color: #dc2626 !important; }
}

// Vertical Separator
.action-divider {
  display: inline-block;
  width: 1px;
  height: 12px;
  background: #e5e7eb;
  margin: 0 4px;
  vertical-align: middle;
}
</style>
