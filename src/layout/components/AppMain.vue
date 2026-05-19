<!--
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-05-26 16:40:53
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-14 18:51:56
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view v-if="!$route.meta.link" :key="key" />
      </keep-alive>
    </transition>
    <iframe-toggle />
  </section>
</template>

<script>
import iframeToggle from "./IframeToggle/index";

export default {
  name: "AppMain",
  components: { iframeToggle },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      // Keep AlarmLayout stable across child route switches
      // so the banner/tabs don't remount on every tab click
      if (this.$route.path.startsWith('/alarmmanger') || this.$route.path.startsWith('/backgroundManage')) {
        return this.$route.path.startsWith('/alarmmanger') ? '/alarmmanger' : '/backgroundManage'
      }
      return this.$route.path
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: auto;
  // background: #f0f2f5;
  padding: 16px;
  box-sizing: border-box;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>
