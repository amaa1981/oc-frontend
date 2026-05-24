<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    @select="handleSelect"
  >
    <template v-for="(item, index) in topMenus">
      <el-menu-item
        :style="{ '--theme': theme }"
        :index="item.path"
        :key="index"
        v-if="index < visibleNumber"
        ><svg-icon :icon-class="item.meta.icon" />
        {{ $t(item.meta.title) }}</el-menu-item
      >
    </template>

    <!-- Top menu collapsed beyond quantity -->
    <el-submenu
      :style="{ '--theme': theme }"
      index="more"
      v-if="topMenus.length > visibleNumber"
    >
      <template slot="title">{{ $t(modal.more) }}</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          :index="item.path"
          :key="index"
          v-if="index >= visibleNumber"
          ><svg-icon :icon-class="item.meta.icon" />
          {{ $t(item.meta.title) }}</el-menu-item
        >
      </template>
    </el-submenu>
  </el-menu>
</template>

<script>
import { constantRoutes } from "@/router";

// Hide sidebar routing
const hideList = ["/index", "/user/profile"];

export default {
  data() {
    return {
      // Top bar initial number
      visibleNumber: 10,
      // The index of the currently active menu
      currentIndex: undefined,
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
    // Show menu at top
    topMenus() {
      let topMenus = [];
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          // Compatible with top bar first-level menu internal jump
          if (menu.path === "/") {
            topMenus.push(menu.children[0]);
          } else {
            topMenus.push(menu);
          }
        }
      });
      return topMenus;
    },
    // All routing information
    routers() {
      return this.$store.state.permission.topbarRouters;
    },
    // Set up subroutes
    childrenMenus() {
      var childrenMenus = [];
      this.routers.map((router) => {
        for (var item in router.children) {
          if (router.children[item].parentPath === undefined) {
            if (router.path === "/") {
              router.children[item].path = "/" + router.children[item].path;
            } else {
              if (!this.ishttp(router.children[item].path)) {
                router.children[item].path =
                  router.path + "/" + router.children[item].path;
              }
            }
            router.children[item].parentPath = router.path;
          }
          childrenMenus.push(router.children[item]);
        }
      });
      return constantRoutes.concat(childrenMenus);
    },
    // Menu activated by default
    activeMenu() {
      const path = this.$route.path;
      let activePath = path;
      if (
        path !== undefined &&
        path.lastIndexOf("/") > 0 &&
        hideList.indexOf(path) === -1
      ) {
        const tmpPath = path.substring(1, path.length);
        activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
        if (!this.$route.meta.link) {
          this.$store.dispatch("app/toggleSideBarHide", false);
        }
      } else if (!this.$route.children) {
        activePath = path;
        this.$store.dispatch("app/toggleSideBarHide", true);
      }
      this.activeRoutes(activePath);
      return activePath;
    },
  },
  beforeMount() {
    window.addEventListener("resize", this.setVisibleNumber);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setVisibleNumber);
  },
  mounted() {
    this.setVisibleNumber();
  },
  methods: {
    // Set the number of columns to display based on width calculations
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width / 3;
      this.visibleNumber = parseInt(width / 85);
    },
    // Menu selection event
    handleSelect(key, keyPath) {
      this.currentIndex = key;
      const route = this.routers.find((item) => item.path === key);
      console.log(key);
      console.log(keyPath);
      if (this.ishttp(key)) {
        // http(s):// path new window opens
        window.open(key, "_blank");
      } else if (!route || !route.children) {
        // No subroute paths are opened internally
        const routeMenu = this.childrenMenus.find((item) => item.path === key);
        if (routeMenu && routeMenu.query) {
          let query = JSON.parse(routeMenu.query);
          this.$router.push({ path: key, query: query });
        } else {
          this.$router.push({ path: key });
        }
        this.$store.dispatch("app/toggleSideBarHide", true);
      } else {
        // If there are sub-routes, it will jump to the first sub-route by default.
        console.log(key);
        const firstChild = this.getFirstChildRoute(route);
        if (firstChild) {
          // If the first sub-route is found, jump to that route
          if (firstChild.query) {
            let query = JSON.parse(firstChild.query);
            this.$router.push({ path: firstChild.path, query: query });
          } else {
            this.$router.push({ path: firstChild.path });
          }
        }
        // Show left linkage menu
        this.activeRoutes(key);
        this.$store.dispatch("app/toggleSideBarHide", false);
      }
    },
    // Currently active route
    activeRoutes(key) {
      var routes = [];
      if (this.childrenMenus && this.childrenMenus.length > 0) {
        this.childrenMenus.map((item) => {
          if (key == item.parentPath || (key == "index" && "" == item.path)) {
            routes.push(item);
          }
        });
      }
      if (routes.length > 0) {
        this.$store.commit("SET_SIDEBAR_ROUTERS", routes);
      } else {
        this.$store.dispatch("app/toggleSideBarHide", true);
      }
    },
    // Get the first accessible sub-route
    getFirstChildRoute(route) {
      if (!route || !route.children || route.children.length === 0) {
        return null;
      }
      
      // Find the first unhidden child route from childrenMenus
      // childrenMenus has processed the complete path to avoid repeated splicing
      const parentPath = route.path;
      
      for (let i = 0; i < this.childrenMenus.length; i++) {
        const child = this.childrenMenus[i];
        // Find the first unhidden child route belonging to the current parent route
        if (child.parentPath === parentPath && child.hidden !== true) {
          return {
            path: child.path,
            query: child.query,
          };
        }
      }
      
      // If no available subroute is found, Back null
      return null;
    },
    ishttp(url) {
      return url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1;
    },
  },
};
</script>

<style lang="scss">
.topmenu-container.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 50px !important;
  line-height: 50px !important;
  color: #999093 !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}

.topmenu-container.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: 2px solid #{"var(--theme)"} !important;
  color: #303133;
}

/* submenu item */
.topmenu-container.el-menu--horizontal > .el-submenu .el-submenu__title {
  float: left;
  height: 50px !important;
  line-height: 50px !important;
  color: #999093 !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}
</style>
