<template>
  <div class="alarm-layout">
    <page-banner
      :title="$t('alarmLayout.title')"
      :subtitle="$t('alarmLayout.subtitle')"
      :deco-image="decoImage"
    >
      <template #tabs>
        <div class="banner-tabs">
          <router-link
            v-for="tab in visibleTabs"
            :key="tab.path"
            :to="tab.fullPath"
            :class="['banner-tab', { active: isActive(tab) }]"
          >
            {{ tab.label }}
          </router-link>
        </div>
      </template>
    </page-banner>
    <div class="alarm-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import decoImg from '@/assets/images/top_bg_right_2.png'

export default {
  name: 'AlarmLayout',
  data() {
    return {
      decoImage: decoImg
    }
  },
  mounted() {
    const appMain = document.querySelector('.app-main')
    if (appMain) {
      appMain.style.padding = '0'
      appMain.style.overflow = 'hidden'
    }
    // 默认选中第一个 tab（仅当不在任何 alarmmanger 子路由时才跳转）
    this.$nextTick(() => {
      if (this.visibleTabs.length && this.$route.path === '/alarmmanger') {
        this.$router.replace(this.visibleTabs[0].fullPath)
      }
    })
  },
  beforeDestroy() {
    const appMain = document.querySelector('.app-main')
    if (appMain) {
      appMain.style.padding = ''
      appMain.style.overflow = ''
    }
  },
  computed: {
    visibleTabs() {
      const sidebarRouters = this.$store.state.permission.sidebarRouters || []
      const alarmRoute = sidebarRouters.find(r => r.path === '/alarmmanger')
      if (!alarmRoute || !alarmRoute.children) return []
      // children 可能被 AlarmLayout 包装器包裹，需要取内层 children
      let children = alarmRoute.children
      if (children.length === 1 && children[0].path === '' && children[0].children) {
        children = children[0].children
      }
      return children
        .filter(c => !c.hidden)
        .map(c => ({
          path: c.path,
          fullPath: c.path.startsWith('/') ? c.path : '/alarmmanger/' + c.path,
          label: c.meta && c.meta.title ? this.getTabLabel(c.meta.title) : c.path
        }))
    }
  },
  methods: {
    isActive(tab) {
      return this.$route.path === tab.fullPath || this.$route.path.startsWith(tab.fullPath + '/')
    },
    getTabLabel(title) {
      // title 可能是 i18n key（如 menu.alarm）或中文文本
      const translated = this.$t(title)
      // 如果翻译成功（不等于 key 本身），使用翻译结果
      if (translated !== title) return translated
      return title
    }
  }
}
</script>

<style lang="scss" scoped>
.alarm-layout {
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
  gap: 4px;
  margin-top: 16px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 4px;
}

.banner-tab {
  padding: 7px 24px;
  border-radius: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  font-weight: 400;

  &:hover {
    color: #fff;
  }

  &.active {
    color: #1a3a4a;
    background: #fff;
    font-weight: 600;
  }
}

.alarm-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  border-radius: 10px;
}
</style>
