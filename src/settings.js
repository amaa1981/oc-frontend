/*
 * @Descripttion:
 * @version:
 * @Author: FGJ
 * @Date: 2023-05-26 16:40:53
 * @LastEditors: FGJ
 * @LastEditTime: 2023-09-08 15:22:45
 */
module.exports = {
  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: 'theme-dark',

  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示顶部导航
   */
  topNav: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: false,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  mapConfig: {
    // 加载地图类型配置，值类型为 amap（高德地图）
    mapType: 'amap',
    // 地图默认中心坐标 [经度, 纬度]
    //沙特
    defaultCenter: [50.10623597796621, 26.43333665104305]
    //香港机场
    // defaultCenter: [113.91436539596975,22.313772163972757]
    //广州公司地址
    // defaultCenter: [113.5177869522218,22.759208422067744]
  },

  /**
   * 版本类型
   * 'saudi' — 沙特版（设备区域使用字典下拉）
   * 'standard' — 标准版（设备区域使用部门树形选择器）
   */
  edition: 'saudi'
}
