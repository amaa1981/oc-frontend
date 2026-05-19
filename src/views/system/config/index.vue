<template>
  <div class="config-layout">
    <page-banner
      :title="$t('menu.configuration')"
      :subtitle="$t('configLayout.subtitle')"
      :deco-image="decoImage"
    >
      <template #tabs>
        <div class="banner-tabs">
          <router-link
            v-for="tab in visibleTabs"
            :key="tab.fullPath"
            :to="tab.fullPath"
            :class="['banner-tab', { active: isActive(tab) }]"
          >
            {{ tab.label }}
          </router-link>
        </div>
      </template>
    </page-banner>
    <div class="config-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import decoImg from '@/assets/images/top_bg_right.png'

export default {
  name: 'ConfigLayout',
  data() {
    return {
      decoImage: decoImg
    }
  },
  computed: {
    visibleTabs() {
      const sidebarRouters = this.$store.state.permission.sidebarRouters || []
      const configRoute = sidebarRouters.find(r => r.path === '/backgroundManage')
      if (!configRoute || !configRoute.children) return []
      let children = configRoute.children
      if (children.length === 1 && children[0].path === '' && children[0].children) {
        children = children[0].children
      }
      return children
        .filter(c => !c.hidden)
        .map(c => ({
          path: c.path,
          fullPath: c.path.startsWith('/') ? c.path : '/backgroundManage/' + c.path,
          label: c.meta && c.meta.title ? this.getTabLabel(c.meta.title) : c.path
        }))
    }
  },
  mounted() {
    const appMain = document.querySelector('.app-main')
    if (appMain) {
      appMain.style.padding = '0'
      appMain.style.overflow = 'hidden'
    }
    this.$nextTick(() => {
      if (this.visibleTabs.length && this.$route.path === '/backgroundManage') {
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
  methods: {
    isActive(tab) {
      return this.$route.path === tab.fullPath || this.$route.path.startsWith(tab.fullPath + '/')
    },
    getTabLabel(title) {
      const translated = this.$t(title)
      if (translated !== title) return translated
      return title
    }
  }
}
</script>

<style lang="scss" scoped>
.config-layout {
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
  padding: 7px 24px;
  border-radius: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
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

.config-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
</style>
