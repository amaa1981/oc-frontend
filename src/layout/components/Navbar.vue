<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
      v-if="false"
    />

    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!topNav"
    />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- Standard edition: device area tree selector -->
        <treeselect
          v-if="edition === 'standard'"
          v-model="installationArea"
          :options="deptOptions"
          :placeholder="$t('navbar.deviceArea')"
          :show-count="true"
          :clearable="true"
          :appendToBody="true"
          :z-index="99999"
          class="right-menu-item device-area-select"
          @input="handleDeviceAreaChange"
        /><el-tooltip
          :content="$t('navbar.lang')"
          effect="dark"
          placement="bottom"
          v-if="showLangSelect"
        >
          <LangSelect class="right-menu-item hover-effect"></LangSelect>
        </el-tooltip>
      </template>

      <router-link to="/user/profile" class="settings-btn right-menu-item">
        <i class="el-icon-setting"></i>
      </router-link>

      <el-dropdown
        class="avatar-container right-menu-item"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" @error="onAvatarError" />
          <div class="user-info">
            <span class="user-name">{{ name }}</span>
            <span class="user-sub">{{ email }}</span>
          </div>
          <i class="el-icon-arrow-down caret-icon" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span>{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import LangSelect from '@/components/LangSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { deptTreeSelect } from '@/api/system/user'
import settings from '@/settings'

export default {
  dicts: ['v1_device_area'],
  data() {
    return {
      installationArea: localStorage.getItem('installationArea') || null,
      showLangSelect: false,
      edition: settings.edition || 'saudi',
      deptOptions: []
    }
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search)
    this.showLangSelect = this.edition === 'standard' || urlParams.get('lan') === 'true'
    if (this.edition === 'standard') {
      deptTreeSelect().then((res) => {
        this.deptOptions = res.data
      })
    }
  },
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
    LangSelect,
    Treeselect
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'name', 'email']),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    },
    currentRoute() {
      return this.$route.path
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    onAvatarError(e) {
      e.target.src = require('@/assets/images/profile.jpg')
    },
    handleDeviceAreaChange(val) {
      localStorage.setItem('installationArea', val || '')
      this.$bus.$emit('installationAreaChange', val)
    },
    async logout() {
      this.$confirm(this.$t('navbar.logOutTip'), this.$t('navbar.tip'), {
        confirmButtonText: this.$t('commonBtn.confirm'),
        cancelButtonText: this.$t('commonBtn.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index'
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: transparent;
  padding-left: 30px;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    padding-right: 16px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .device-area-select {
      width: 180px;
      height: auto;
      line-height: normal;
      padding: 0;
      margin-right: 8px;
      ::v-deep .vue-treeselect__control {
        border-radius: 8px;
        border-color: #e4e7ed;
        height: 34px;
        background: #fff;
      }
      ::v-deep .vue-treeselect__placeholder,
      ::v-deep .vue-treeselect__single-value {
        font-size: 13px;
        line-height: 34px;
        color: #606266;
      }
    }

    .settings-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      transition: background 0.2s;
      flex-shrink: 0;
      margin-right: 5px;
      i {
        font-size: 20px;
        color: #333;
      }
      &:hover {
        background: #e8f5f4;
        i { color: #26a69a; }
      }
    }

    .avatar-container {
      height: auto;
      line-height: normal;
      padding: 0;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 999px;
        padding: 5px 14px 5px 5px;
        box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        gap: 10px;

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;

          .user-name {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
            white-space: nowrap;
          }

          .user-sub {
            font-size: 12px;
            color: #999;
            line-height: 1.3;
            white-space: nowrap;
          }
        }

        .caret-icon {
          font-size: 13px;
          color: #666;
          flex-shrink: 0;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
