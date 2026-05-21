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
      <el-table-column :label="$t('device.ID')" align="center" prop="deviceId">
      </el-table-column>
      <el-table-column
        :label="$t('device.image')"
        align="center"
        prop="image"
        width="150"
      >
        <template slot-scope="scope">
          <img
            :src="'data:image/png;base64,' + scope.row.imageData"
            style="width: 150px; height: 100px"
          />
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
        :label="$t('device.coordinate')"
        align="center"
        prop="coordinate"
      />
      <el-table-column
        :label="$t('device.status')"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === '1'" class="device-status device-status--online">
            <i class="status-dot" />{{ $t("dict.v1_device_status." + scope.row.status) }}
          </span>
          <span v-else-if="scope.row.status" class="device-status device-status--offline">
            <i class="status-dot" />{{ $t("dict.v1_device_status." + scope.row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('device.operate')"
        align="center"
        class-name="small-padding fixed-width"
        width="280px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            class="btn-view"
            @click="getTask(scope.row)"
            >{{ $t("device.taskDetail") }}</el-button
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

    <!-- 添加或修改设备信息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="560px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <!-- 设备名称 — 全宽 -->
        <el-form-item :label="$t('device.deviceName')" prop="deviceName">
          <el-input
            v-model="form.deviceName"
            :placeholder="$t('commonTips.pleaseEnter')"
          />
        </el-form-item>

        <!-- 设备类型 + 厂商类型 -->
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

        <!-- 协议类型 + 设备区域 -->
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
              <!-- 标准版：树形选择器 -->
              <treeselect
                v-if="edition === 'standard'"
                v-model="form.installationArea"
                :options="deptOptions"
                :show-count="true"
                :placeholder="$t('commonTips.pleaseSelect')"
              />
              <!-- 沙特版：字典下拉 -->
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

        <!-- 安装位置 — 全宽 -->
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

        <!-- 用户名 + 密码 -->
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

        <!-- nvr显示的字段 -->
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

        <!-- rtsp需要显示的字段 -->
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

        <!-- 坐标 — 全宽 -->
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

          <!-- Mapbox 地图 -->
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

          <!-- 地图加载提示 -->
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

    <!-- 监控弹窗组件 -->
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

// 获取全局地图默认中心坐标
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
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备信息表格数据
      deviceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 部门树选项（标准版使用）
      deptOptions: [],
      // 版本类型
      edition: settings.edition || 'saudi',
      // 查询参数
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
      // 表单参数
      form: {},
      disabled: false,
      // 表单校验
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
        rtspMain: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        rtspSub: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        coordinate: [
          {
            required: true,
            message: this.$t("commonTips.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
      },

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
      // Mapbox 地图相关配置
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
    // 监听设备区域变化
    this.$bus.$on('installationAreaChange', this.onInstallationAreaChange)
  },
  beforeDestroy() {
    // 移除监听
    this.$bus.$off('installationAreaChange', this.onInstallationAreaChange);
  },
  mounted() {},
  methods: {
    // 设备区域变化处理
    onInstallationAreaChange(val) {
      this.queryParams.installationArea = val || null;
      this.handleQuery();
    },
    // 获取部门树（标准版）
    getDeptTree() {
      return deptTreeSelect().then((response) => {
        this.deptOptions = response.data
      })
    },
    // 根据部门ID获取名称（标准版列表显示）
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
    // Mapbox 地图事件处理
    onDeviceMapInit(map) {
      console.log("设备 Mapbox 地图初始化完成", map);
      this.map = map;
      this.updateDeviceMarkers();
    },

    onDeviceMapClick(e) {
      console.log("设备地图点击事件", e);
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      this.position.lng = lng;
      this.position.lat = lat;
      this.form.coordinate = lng + "," + lat;

      // 更新设备标记位置
      this.updateDeviceMarkers([lng, lat]);
    },

    onMarkerDragEnd(e) {
      console.log("标记拖拽结束事件", e);
      const lng = e.position[0];
      const lat = e.position[1];

      this.position.lng = lng;
      this.position.lat = lat;
      this.form.coordinate = lng + "," + lat;

      // 更新标记位置
      this.updateDeviceMarkers([lng, lat]);
    },

    // 更新设备标记点
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
    //根据名称搜索位置（使用Mapbox Geocoding API）
    async setView() {
      if (!this.keyword || !this.map) {
        this.$message.warning("Please enter search keywords");
        return;
      }

      try {
        // 使用 Mapbox Geocoding API 进行地名搜索
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

          // 更新地图中心和标记位置
          this.amapCenter = location;
          this.position.lng = location[0];
          this.position.lat = location[1];
          this.form.coordinate = location[0] + "," + location[1];

          // 移动地图到搜索位置
          this.map.flyTo({
            center: location,
            zoom: 16,
            essential: true,
          });

          // 更新标记点
          this.updateDeviceMarkers(location);

          this.$message.success(`Found: ${feature.place_name}`);
        } else {
          this.$message.error("No address found");
        }
      } catch (error) {
        console.error("搜索地址时出错:", error);
        this.$message.error("Address search failed, please try again");
      }
    },
    //拼接rtsp路径
    changertsp() {
      console.log(this.form);

      let rtspurl = "";

      //海康旧私有协议
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
      //大华
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
    //跳转到设置任务
    getTask(row) {
      this.$router.push({
        path: "/alarmmanger/task",
        query: { deviceId: row.id, deviceCode: row.deviceId },
      });
    },
    //确认坐标
    setok() {
      this.dialogMap = false;
      this.sign = false;
      this.mapReady = false;
      // 清理地图实例引用
      this.map = null;
      console.log("地图弹窗已关闭，所有状态已重置");
    },
    //地图点击事件
    handleMapClick(e) {
      console.log(e.lnglat);
      const lng = e.lnglat.lng;
      const lat = e.lnglat.lat;

      this.position.lng = lng;
      this.position.lat = lat;
      this.form.coordinate = lng + "," + lat;

      // 更新标记位置
      this.markerPosition = [lng, lat];
    },
    //标记拖拽结束事件
    handleMarkerDragEnd(e) {
      console.log(e.lnglat);
      const lng = e.lnglat.lng;
      const lat = e.lnglat.lat;

      this.position.lng = lng;
      this.position.lat = lat;
      this.form.coordinate = lng + "," + lat;

      // 更新标记位置
      this.markerPosition = [lng, lat];
    },
    //显示地图
    positioning() {
      console.log("ok");
      console.log(this.form.coordinate);
      this.sign = true;
      setTimeout(() => {
        // 重置地图状态
        this.mapReady = false;
        this.map = null;

        this.dialogMap = true;
        //经度和纬度
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
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
    // 多选框选中数据
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
    // 弹窗打开时触发，用于确保地图实例已创建
    handleDialogOpened() {
      this.mapReady = true;
      // 延迟确保地图正确初始化
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
  beforeDestroy() {},
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
// 在线/离线状态胶囊
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

// 坐标行
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

// 操作列按钮颜色
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

// 竖线分隔符
.action-divider {
  display: inline-block;
  width: 1px;
  height: 12px;
  background: #e5e7eb;
  margin: 0 4px;
  vertical-align: middle;
}
</style>
