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
   * Sidebar theme: theme-dark or theme-light
   */
  sideTheme: 'theme-dark',

  /**
   * Whether to show layout settings
   */
  showSettings: false,

  /**
   * Whether to show top navigation
   */
  topNav: false,

  /**
   * Whether to show tags view
   */
  tagsView: false,

  /**
   * Whether to fix header
   */
  fixedHeader: false,

  /**
   * Whether to show logo
   */
  sidebarLogo: true,

  /**
   * Whether to display dynamic Title
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
    // Map provider type (e.g. amap)
    mapType: 'amap',
    // Default map center [lng, lat]
    //Saudi Arabia
    defaultCenter: [50.10623597796621, 26.43333665104305]
    //Hong Kong Airport
    // defaultCenter: [113.91436539596975,22.313772163972757]
    //Guangzhou company address
    // defaultCenter: [113.5177869522218,22.759208422067744]
  },

  /**
   * Edition type
   * 'saudi' — Saudi edition (device area uses dictionary select)
   * 'standard' — Standard edition (device area uses department tree)
   */
  edition: 'saudi'
}
