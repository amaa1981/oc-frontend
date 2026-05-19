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

    <!-- 顶部菜单超出数量折叠 -->
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

// 隐藏侧边栏路由
const hideList = ["/index", "/user/profile"];

export default {
  data() {
    return {
      // 顶部栏初始数
      visibleNumber: 10,
      // 当前激活菜单的 index
      currentIndex: undefined,
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
    // 顶部显示菜单
    topMenus() {
      let topMenus = [];
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          // 兼容顶部栏一级菜单内部跳转
          if (menu.path === "/") {
            topMenus.push(menu.children[0]);
          } else {
            topMenus.push(menu);
          }
        }
      });
      return topMenus;
    },
    // 所有的路由信息
    routers() {
      return this.$store.state.permission.topbarRouters;
    },
    // 设置子路由
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
    // 默认激活的菜单
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
    // 根据宽度计算设置显示栏数
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width / 3;
      this.visibleNumber = parseInt(width / 85);
    },
    // 菜单选择事件
    handleSelect(key, keyPath) {
      this.currentIndex = key;
      const route = this.routers.find((item) => item.path === key);
      console.log(key);
      console.log(keyPath);
      if (this.ishttp(key)) {
        // http(s):// 路径新窗口打开
        window.open(key, "_blank");
      } else if (!route || !route.children) {
        // 没有子路由路径内部打开
        const routeMenu = this.childrenMenus.find((item) => item.path === key);
        if (routeMenu && routeMenu.query) {
          let query = JSON.parse(routeMenu.query);
          this.$router.push({ path: key, query: query });
        } else {
          this.$router.push({ path: key });
        }
        this.$store.dispatch("app/toggleSideBarHide", true);
      } else {
        // 有子路由，默认跳转到第一个子路由
        console.log(key);
        const firstChild = this.getFirstChildRoute(route);
        if (firstChild) {
          // 如果找到第一个子路由，跳转到该路由
          if (firstChild.query) {
            let query = JSON.parse(firstChild.query);
            this.$router.push({ path: firstChild.path, query: query });
          } else {
            this.$router.push({ path: firstChild.path });
          }
        }
        // 显示左侧联动菜单
        this.activeRoutes(key);
        this.$store.dispatch("app/toggleSideBarHide", false);
      }
    },
    // 当前激活的路由
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
    // 获取第一个可访问的子路由
    getFirstChildRoute(route) {
      if (!route || !route.children || route.children.length === 0) {
        return null;
      }
      
      // 从 childrenMenus 中查找第一个未隐藏的子路由
      // childrenMenus 已经处理好了完整路径，避免重复拼接
      const parentPath = route.path;
      
      for (let i = 0; i < this.childrenMenus.length; i++) {
        const child = this.childrenMenus[i];
        // 找到属于当前父路由的第一个未隐藏的子路由
        if (child.parentPath === parentPath && child.hidden !== true) {
          return {
            path: child.path,
            query: child.query,
          };
        }
      }
      
      // 如果没有找到可用的子路由，返回 null
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
