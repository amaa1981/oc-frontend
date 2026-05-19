<template>
  <div class="bg-layout">
    <page-banner
      :title="$t('backgroundConfigurationManage.title')"
      :subtitle="$t('backgroundConfigurationManage.subtitle')"
      :deco-image="decoImage"
    >
      <template #tabs>
        <div class="banner-tabs">
          <span
            v-for="item in flatTabs"
            :key="item.key"
            :class="['banner-tab', { active: activeName === item.key }]"
            @click="activeName = item.key"
          >
            {{ item.label }}
          </span>
        </div>
      </template>
    </page-banner>

    <div class="bg-content">
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
import decoImg from '@/assets/images/top_bg_right.png'
import Network from '../backgroundManage/components/network.vue'
import Mqtt from '../backgroundManage/components/mqtt.vue'
import Alarm from '../backgroundManage/components/alarm.vue'
import Http from '../backgroundManage/components/http.vue'
import Phone from '../backgroundManage/components/phone.vue'
import Email from '../backgroundManage/components/email.vue'
import Jar from '../backgroundManage/components/jar.vue'
import ServicePackageInfo from '../backgroundManage/components/servicePackageInfo.vue'
import PublicAccount from '../backgroundManage/components/publicAccount.vue'
import Audio from '../backgroundManage/components/audio.vue'

export default {
  name: 'BackgroundLayout',
  components: {
    Network, Mqtt, Alarm, Http, Phone, Email, Jar, ServicePackageInfo, PublicAccount, Audio
  },
  data() {
    return {
      decoImage: decoImg,
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
  },
  mounted() {
    const appMain = document.querySelector('.app-main')
    if (appMain) {
      appMain.style.padding = '0'
      appMain.style.overflow = 'hidden'
    }
  },
  beforeDestroy() {
    const appMain = document.querySelector('.app-main')
    if (appMain) {
      appMain.style.padding = ''
      appMain.style.overflow = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-layout {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
  box-sizing: border-box;
  background: #f0f2f5;
}

.banner-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 16px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 4px;
}

.banner-tab {
  padding: 7px 20px;
  border-radius: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-weight: 400;
  user-select: none;

  &:hover {
    color: #fff;
  }

  &.active {
    color: #1a3a4a;
    background: #fff;
    font-weight: 600;
  }
}

.bg-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;

  ::v-deep .app-container {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 0 !important;
  }
}
</style>
