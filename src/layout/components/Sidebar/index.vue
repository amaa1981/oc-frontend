<template>
    <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: variables.menuBackground }" class="sidebar-inner">
        <logo v-if="showLogo" :collapse="isCollapse" @toggle="toggleSidebar" />
        <el-scrollbar class="theme-dark" wrap-class="scrollbar-wrapper">
            <el-menu
                ref="sideMenu"
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="variables.menuBackground"
                :text-color="variables.menuColor"
                :unique-opened="true"
                active-text-color="#1a7a6e"
                :collapse-transition="false"
                mode="vertical"
            >
                <sidebar-item
                    v-for="(route, index) in sidebarRouters"
                    :key="route.path  + index"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>

        <!-- 告警卡片，折叠时隐藏 -->
        <div v-if="!isCollapse" class="alarm-card">
            <div class="alarm-card__header">
                <span class="alarm-card__header-left">
                    <i class="alarm-card__bell-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="#26a69a"/>
                        </svg>
                    </i>
                    <span class="alarm-card__title">{{ $t('sidebarAlarm.recentAlerts') }}</span>
                </span>
                <span class="alarm-card__badge">{{ todayTotal }}</span>
            </div>
            <div class="alarm-card__divider" />
            <div v-if="alarmList.length === 0" class="alarm-card__empty">{{ $t('sidebarAlarm.noAlerts') }}</div>
            <template v-else>
                <div v-for="(item, idx) in alarmList" :key="item.id || idx" class="alarm-card__item">
                    <div class="alarm-card__item-info">
                        <span class="alarm-card__item-type">{{ item.eventTypeId || item.violationType }}</span>
                        <span class="alarm-card__item-device">{{ item.equipmentName }}</span>
                    </div>
                    <span :class="['alarm-card__time-badge', timeClass(item.sendTime)]">{{ timeAgo(item.sendTime) }}</span>
                    <div v-if="idx < alarmList.length - 1" class="alarm-card__item-divider" />
                </div>
            </template>
            <div class="alarm-card__divider" />
            <div class="alarm-card__footer" @click="$router.push('/alarmmanger/record')">
                {{ $t('sidebarAlarm.viewAll') }}
            </div>
        </div>

        <!-- 折叠按钮，绝对定位在侧边栏右边缘外 -->
        <button class="sidebar-toggle-btn" @click="toggleSidebar">
            <i :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
        </button>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'
import { listRecord } from '@/api/system/record'
import dayjs from 'dayjs'

export default {
    components: { SidebarItem, Logo },
    data() {
        return {
            alarmList: [],
            todayTotal: 0,
            alarmTimer: null
        }
    },
    computed: {
        ...mapState(['settings']),
        ...mapGetters(['sidebarRouters', 'sidebar']),
        activeMenu() {
            const route = this.$route
            const { meta, path } = route
            if (meta.activeMenu) {
                return meta.activeMenu
            }
            return path
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo
        },
        variables() {
            return variables
        },
        isCollapse() {
            return !this.sidebar.opened
        }
    },
    mounted() {
        this.disableMenuHoverBg()
        this.fetchAlarms()
        this.alarmTimer = setInterval(this.fetchAlarms, 60000)
        // Listen for real-time alerts from WebSocket
        this.$bus.$on('newAlert', this.onNewAlert)
    },
    beforeDestroy() {
        if (this.alarmTimer) clearInterval(this.alarmTimer)
        this.$bus.$off('newAlert', this.onNewAlert)
    },
    updated() {
        this.disableMenuHoverBg()
    },
    methods: {
        toggleSidebar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        onNewAlert(alert) {
            // Add to top of list
            this.alarmList.unshift({
                id: alert.id,
                eventTypeId: alert.violationType || alert.eventTypeId,
                equipmentName: alert.equipmentName || alert.deviceName,
                sendTime: alert.sendTime || alert.createTime
            })
            // Keep only 3
            if (this.alarmList.length > 3) {
                this.alarmList = this.alarmList.slice(0, 3)
            }
            // Increment counter
            this.todayTotal += 1
        },
        fetchAlarms() {
            const today = dayjs().format('YYYY-MM-DD')
            listRecord({
                pageNum: 1,
                pageSize: 3,
                beginTime: today + ' 00:00:00',
                endTime: today + ' 23:59:59'
            })
            .then(res => {
                if (res && res.data) {
                    const records = res.data.records || res.data.rows || []
                    this.alarmList = records.slice(0, 3).map(r => ({
                        id: r.id,
                        eventTypeId: r.violationType || r.eventTypeId,
                        equipmentName: r.deviceName || r.deviceId || r.equipmentName,
                        sendTime: r.createTime || r.sendTime
                    }))
                    this.todayTotal = res.data.totalCount || res.data.total || 0
                }
            })
            .catch(() => {})
        },
        timeAgo(sendTime) {
            if (!sendTime) return ''
            const diff = dayjs().diff(dayjs(sendTime), 'minute')
            if (diff < 1) return '<1m'
            if (diff < 60) return diff + 'm'
            const h = Math.floor(diff / 60)
            return h + 'h'
        },
        timeClass(sendTime) {
            if (!sendTime) return 'badge-blue'
            const diff = dayjs().diff(dayjs(sendTime), 'minute')
            if (diff <= 5) return 'badge-red'
            if (diff <= 30) return 'badge-orange'
            return 'badge-blue'
        },
        disableMenuHoverBg() {
            this.$nextTick(() => {
                const menu = this.$refs.sideMenu
                if (!menu) return
                const items = Object.values(menu.items || {})
                const submenus = Object.values(menu.submenus || {})
                const noop = function() {}
                items.forEach(item => {
                    if (item.onMouseEnter) item.onMouseEnter = noop
                    if (item.onMouseLeave) item.onMouseLeave = noop
                    if (item.$el) item.$el.style.backgroundColor = ''
                })
                submenus.forEach(sub => {
                    if (sub.handleTitleMouseenter) sub.handleTitleMouseenter = noop
                    if (sub.handleTitleMouseleave) sub.handleTitleMouseleave = noop
                    const title = sub.$refs && sub.$refs['submenu-title']
                    if (title) title.style.backgroundColor = ''
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.sidebar-inner {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.alarm-card {
  margin: 0 10px 25px;
  background: #1A4759;
  border-radius: 14px;
  padding: 10px 12px 0;
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.07);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__bell-icon {
    display: flex;
    align-items: center;
    font-style: normal;
  }

  &__title {
    font-size: 12px;
    font-weight: 700;
    color: #e0eaf0;
    letter-spacing: 0.2px;
  }

  &__badge {
    background: #e53935;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
  }

  &__divider {
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin: 0 -12px;
  }

  &__empty {
    font-size: 11px;
    color: #7a9aaa;
    text-align: center;
    padding: 10px 0;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  &__item-divider {
    position: absolute;
    bottom: 0;
    left: -12px;
    right: -12px;
    height: 1px;
    background: rgba(255,255,255,0.08);
  }

  &__item-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    margin-right: 8px;
  }

  &__item-type {
    font-size: 11px;
    font-weight: 600;
    color: #ddeaf2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }

  &__item-device {
    font-size: 10px;
    color: #6a8a9a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__time-badge {
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
    padding: 2px 7px;
    border-radius: 5px;

    &.badge-red {
      background: rgba(229, 57, 53, 0.35);
      color: #ff6b6b;
    }

    &.badge-orange {
      background: rgba(180, 120, 0, 0.45);
      color: #ffb74d;
    }

    &.badge-blue {
      background: rgba(38, 166, 154, 0.2);
      color: #4dd0c4;
    }
  }

  &__footer {
    padding: 8px 0;
    font-size: 11px;
    font-weight: 600;
    color: #26a69a;
    cursor: pointer;
    text-align: center;
    letter-spacing: 0.2px;

    &:hover {
      color: #4dd0c4;
    }
  }
}

.sidebar-toggle-btn {
  position: fixed;
  top: 22px;
  left: calc(#{$base-sidebar-width} - 15px);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: #fff;
  color: #1a2a36;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transition: left 0.28s, background 0.2s;

  i {
    font-size: 12px;
    font-weight: 700;
  }

  &:hover {
    background: #f0f0f0;
  }
}
</style>