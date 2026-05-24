<template>
  <div class="bg-manage-wrap">
    <!-- Left navigation -->
    <div class="bg-nav">
      <div
        v-for="item in flatTabs"
        :key="item.key"
        :class="['bg-nav-item', { active: activeName === item.key }]"
        @click="activeName = item.key"
      >{{ item.label }}</div>
    </div>

    <!-- Right content -->
    <div class="bg-body">
      <Network v-if="activeName === 'network'" />
      <Alarm v-if="activeName === 'alarm'" />
      <Http v-if="activeName === 'http'" />
      <Phone v-if="activeName === 'phone'" />
      <Email v-if="activeName === 'email'" />
      <Mqtt v-if="activeName === 'mqtt'" />
      <Audio v-if="activeName === 'Audio'" />
      <Jar v-if="activeName === 'Jar'" />
      <ServicePackageInfo v-if="activeName === 'servicePackage'" />
      <PublicAccount v-if="activeName === 'publicAccountConfig'" />
    </div>
  </div>
</template>

<script>
import Network from './components/network.vue'
import Mqtt from './components/mqtt.vue'
import Alarm from './components/alarm.vue'
import Http from './components/http.vue'
import Phone from './components/phone.vue'
import Email from './components/email.vue'
import Jar from './components/jar.vue'
import ServicePackageInfo from './components/servicePackageInfo.vue'
import PublicAccount from './components/publicAccount.vue'
import Audio from './components/audio.vue'

export default {
  name: 'BackgroundManage',
  components: {
    Network, Mqtt, Alarm, Http, Phone, Email, Jar, ServicePackageInfo, PublicAccount, Audio
  },
  data() {
    return {
      activeName: 'alarm'
    }
  },
  computed: {
    isWindows() {
      return process.env.VUE_APP_TYPE === 'windows'
    },
    flatTabs() {
      const tabs = []
      if (!this.isWindows) {
        tabs.push({ key: 'network', label: this.$t('backgroundConfigurationManage.networknformationConfig') })
      }
      tabs.push({ key: 'alarm', label: this.$t('backgroundConfigurationManage.systemConfiguration') })
      tabs.push({ key: 'http', label: this.$t('push.httpPush') })
      tabs.push({ key: 'phone', label: this.$t('push.phonePush') })
      tabs.push({ key: 'email', label: this.$t('push.emailPush') })
      tabs.push({ key: 'mqtt', label: this.$t('backgroundConfigurationManage.mqttConfig') })
      tabs.push({ key: 'Audio', label: this.$t('backgroundConfigurationManage.audio') })
      if (!this.isWindows) {
        tabs.push({ key: 'Jar', label: this.$t('backgroundConfigurationManage.jarUpload') })
        tabs.push({ key: 'servicePackage', label: this.$t('backgroundConfigurationManage.servicenstallationackageInfo') })
      }
      tabs.push({ key: 'publicAccountConfig', label: this.$t('backgroundConfigurationManage.publicAccountConfig') })
      return tabs
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-manage-wrap {
  display: flex;
  height: 100%;
  min-height: 0;
}

.bg-nav {
  width: 200px;
  flex-shrink: 0;
  border-right: 1px solid #ebeef5;
  padding: 16px 0;
  overflow-y: auto;
}

.bg-nav-item {
  padding: 10px 24px;
  font-size: 14px;
  color: #909399;
  cursor: pointer;
  line-height: 1.5;
  transition: color 0.15s;

  &:hover {
    color: #303133;
  }

  &.active {
    color: #303133;
    font-weight: 600;
  }
}

.bg-body {
  flex: 1;
  overflow: auto;
  padding: 20px 24px;

  ::v-deep .app-container {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 0 !important;
  }

  ::v-deep .el-button--primary {
    background: linear-gradient(270deg, #0f6a71 0%, #29908d 100%);
    box-shadow: 0 0 0 1px #156475;
    border: 1px solid transparent;
    border-radius: 10px;
    color: #fff;
    font-weight: 500;

    &:hover,
    &:focus {
      background: linear-gradient(270deg, #0a5a60 0%, #1f7a77 100%);
    }
  }

  ::v-deep .el-button--primary.is-plain {
    background: linear-gradient(270deg, #0f6a71 0%, #29908d 100%);
    box-shadow: 0 0 0 1px #156475;
    border: 1px solid transparent;
    border-radius: 10px;
    color: #fff;
    font-weight: 500;

    &:hover,
    &:focus {
      background: linear-gradient(270deg, #0a5a60 0%, #1f7a77 100%);
      color: #fff;
    }
  }
}
</style>
