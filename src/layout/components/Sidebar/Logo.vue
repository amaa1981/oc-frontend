<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link collapse-link" to="/">
        <img v-if="logoSmall" :src="logoSmall" class="sidebar-logo-icon-small" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/data">
        <img v-if="logo" :src="logo" class="sidebar-logo-icon" />
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/images/logo.png'
import logo2Img from '@/assets/images/logo2.png'
import logoSmallImg from '@/assets/images/logo-small.png'
import logo2SmallImg from '@/assets/images/logo2-small.png'
import settings from '@/settings'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Edge Terminal',
      logo: settings.edition === 'standard' ? logo2Img : logoImg,
      logoSmall:settings.edition === 'standard' ? logo2SmallImg : logoSmallImg, 
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 0.3s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-shrink: 0;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .sidebar-logo-link {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    height: 100%;
    text-decoration: none;
    min-width: 0;
  }

  .collapse-link {
    justify-content: center;
    flex: 0 0 auto;
  }

  .sidebar-logo-icon {
    max-width: 100%;
    max-height: 36px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .sidebar-logo-icon-small {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  &.collapse {
    padding: 16px 10px;
    justify-content: center;

    .sidebar-logo-link {
      flex: unset;
      width: auto;
      justify-content: center;
    }
  }
}
</style>
