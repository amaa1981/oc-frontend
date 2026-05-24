<template>
  <div class="monitor-container">
    <page-banner
      title="Monitoring Center"
      subtitle="Real-time monitoring of kitchen safety cameras and devices"
      :deco-image="decoImage"
    />

    <div class="monitor-body">
      <!-- Stats Row -->
      <div class="monitor-stats">
        <div class="stat-box">
          <i class="el-icon-video-camera stat-icon"></i>
          <div class="stat-info">
            <div class="stat-num">{{ cameras.length }}</div>
            <div class="stat-label">Total Cameras</div>
          </div>
        </div>
        <div class="stat-box online">
          <i class="el-icon-circle-check stat-icon"></i>
          <div class="stat-info">
            <div class="stat-num">{{ cameras.filter(c => c.status === 'online').length }}</div>
            <div class="stat-label">Online</div>
          </div>
        </div>
        <div class="stat-box offline">
          <i class="el-icon-circle-close stat-icon"></i>
          <div class="stat-info">
            <div class="stat-num">{{ cameras.filter(c => c.status === 'offline').length }}</div>
            <div class="stat-label">Offline</div>
          </div>
        </div>
        <div class="stat-box alert">
          <i class="el-icon-warning stat-icon"></i>
          <div class="stat-info">
            <div class="stat-num">{{ todayAlerts }}</div>
            <div class="stat-label">Today's Alerts</div>
          </div>
        </div>
      </div>

      <!-- Grid Switcher -->
      <div class="grid-controls">
        <span class="grid-label">Camera Layout:</span>
        <div class="grid-switcher">
          <div
            v-for="option in gridOptions"
            :key="option.value"
            :class="['grid-option', { active: gridSize === option.value }]"
            @click="setGrid(option.value)"
          >
            <i :class="option.icon"></i>
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Camera Grid -->
      <div :class="['camera-grid', `grid-${gridSize}`]">
        <div
          class="camera-card"
          v-for="camera in visibleCameras"
          :key="camera.id"
        >
          <div class="camera-feed">
            <video
              v-if="camera.id === 1 && camera.status === 'online'"
              :ref="'webcam_' + camera.id"
              autoplay
              muted
              playsinline
              class="webcam-feed"
            ></video>
            <div v-else class="camera-placeholder">
              <i class="el-icon-video-camera-solid"></i>
              <p>{{ camera.name }}</p>
            </div>
            <span :class="['status-dot', camera.status]"></span>
            <div class="camera-overlay">
              <span class="camera-label">{{ camera.name }}</span>
              <el-tag
                :type="camera.status === 'online' ? 'success' : 'danger'"
                size="mini"
                effect="dark"
              >
                {{ camera.status === 'online' ? 'Online' : 'Offline' }}
              </el-tag>
            </div>
          </div>
          <div class="camera-info" v-if="gridSize === 4">
            <div class="camera-name">{{ camera.name }}</div>
            <div class="camera-location">
              <i class="el-icon-location"></i> {{ camera.location }}
            </div>
            <div class="camera-status">
              <el-tag :type="camera.status === 'online' ? 'success' : 'danger'" size="mini">
                {{ camera.status === 'online' ? 'Online' : 'Offline' }}
              </el-tag>
              <span class="camera-alerts" v-if="camera.alerts > 0">
                <i class="el-icon-bell"></i> {{ camera.alerts }} alerts today
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listRecord } from "@/api/system/record";
import decoImg from '@/assets/images/top_bg_right.png'

export default {
  name: "MonitorIndex",
  dicts: ["v1_alarm_type"],
  data() {
    return {
      decoImage: decoImg,
      todayAlerts: 0,
      gridSize: 4,
      gridOptions: [
        { value: 4, label: '4', icon: 'el-icon-menu' },
        { value: 8, label: '8', icon: 'el-icon-s-grid' },
        { value: 16, label: '16', icon: 'el-icon-grid' },
      ],
      cameras: [
        { id: 1, name: 'Mac Webcam', location: 'Kitchen', status: 'online', alerts: 0 },
      ],
    };
  },
  computed: {
    visibleCameras() {
      return this.cameras.slice(0, this.gridSize);
    },
  },
  created() {
    this.fetchAlerts();
  },
  methods: {
    setGrid(size) {
      this.gridSize = size;
    },
    fetchAlerts() {
      const today = new Date();
      const pad = n => String(n).padStart(2, '0');
      const dateStr = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
      listRecord({
        pageNum: 1,
        pageSize: 5,
        startTime: dateStr + ' 00:00:00',
        endTime: dateStr + ' 23:59:59'
      }).then(res => {
        this.todayAlerts = res.data.totalCount || 0;
        this.cameras[0].alerts = this.todayAlerts;
      }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.monitor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  gap: 16px;
  box-sizing: border-box;
  overflow-y: auto;
}

.monitor-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.monitor-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  .stat-box {
    background: #fff;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    border-left: 4px solid #1a7a6e;

    &.online { border-left-color: #67c23a; }
    &.offline { border-left-color: #f56c6c; }
    &.alert { border-left-color: #e6a23c; }

    .stat-icon {
      font-size: 28px;
      color: #1a7a6e;
    }
    &.online .stat-icon { color: #67c23a; }
    &.offline .stat-icon { color: #f56c6c; }
    &.alert .stat-icon { color: #e6a23c; }

    .stat-info {
      .stat-num { font-size: 24px; font-weight: 700; color: #1a2a36; }
      .stat-label { font-size: 12px; color: #8c9bab; margin-top: 2px; }
    }
  }
}

.grid-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);

  .grid-label {
    font-size: 13px;
    color: #5a6b7b;
    font-weight: 500;
  }

  .grid-switcher {
    display: flex;
    gap: 8px;

    .grid-option {
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid #e4e7ed;
      color: #606266;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;

      &:hover { border-color: #1a7a6e; color: #1a7a6e; }
      &.active { background: #1a7a6e; color: #fff; border-color: #1a7a6e; }
    }
  }
}

.camera-grid {
  display: grid;
  gap: 12px;

  &.grid-4 {
    grid-template-columns: repeat(2, 1fr);
    .camera-feed { height: 280px; }
  }

  &.grid-8 {
    grid-template-columns: repeat(4, 1fr);
    .camera-feed { height: 180px; }
  }

  &.grid-16 {
    grid-template-columns: repeat(4, 1fr);
    .camera-feed { height: 140px; }
  }

  .camera-card {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);

    .camera-feed {
      background: #1a2a36;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .camera-placeholder {
        text-align: center;
        color: #4a6a7a;
        i { font-size: 36px; display: block; margin-bottom: 8px; }
        p { margin: 0; font-size: 12px; }
      }

      .status-dot {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        &.online { background: #67c23a; box-shadow: 0 0 6px #67c23a; }
        &.offline { background: #f56c6c; }
      }

      .camera-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        padding: 8px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .camera-label {
          font-size: 11px;
          color: #fff;
          font-weight: 500;
        }
      }
    }

    .camera-info {
      padding: 10px 14px;

      .camera-name { font-size: 13px; font-weight: 600; color: #1a2a36; margin-bottom: 3px; }
      .camera-location { font-size: 11px; color: #8c9bab; margin-bottom: 6px; }
      .camera-status {
        display: flex;
        align-items: center;
        gap: 8px;
        .camera-alerts { font-size: 11px; color: #e6a23c; }
      }
    }
  }
}

@media (max-width: 900px) {
  .monitor-stats { grid-template-columns: repeat(2, 1fr); }
  .camera-grid {
    &.grid-4 { grid-template-columns: repeat(2, 1fr); }
    &.grid-8 { grid-template-columns: repeat(2, 1fr); }
    &.grid-16 { grid-template-columns: repeat(2, 1fr); }
  }
}
</style>