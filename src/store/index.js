/*
 * @Author: FGJ
 * @Date: 2023-05-26 16:40:53
 * @Descripttion: 
 * @LastEditTime: 2025-05-12 11:30:35
 * @LastEditors: FGJ
 * @version: 
 */
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import dict from './modules/dict'
import user from './modules/user'
import mqtt from './modules/mqtt'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    dict,
    user,
    tagsView,
    permission,
    settings,
    mqtt,
  },
  getters,
});

export default store
