const state = {
  warmList: [],
  firstLoad: false,
  newWarmingData: {},
  showList: [],
  playIndex: 1,
  connected: false,
  opens: false,
}

const mutations = {
  SET_WARM_LIST: (state, list) => {
    state.warmList = list
  },
  SET_FIRST_LOAD: (state, status) => {
    state.firstLoad = status
  },
  SET_NEW_WARMING_DATA: (state, data) => {
    state.newWarmingData = data
  },
  SET_SHOW_LIST: (state, list) => {
    state.showList = list
  },
  SET_PLAY_INDEX: (state, index) => {
    state.playIndex = index
  },
  SET_CONNECTED: (state, status) => {
    state.connected = status
  },
  SET_OPENS: (state, status) => {
    state.opens = status
  }
}

const actions = {
  setWarmList({ commit }, list) {
    commit('SET_WARM_LIST', list)
  },
  setFirstLoad({ commit }, status) {
    commit('SET_FIRST_LOAD', status)
  },
  setNewWarmingData({ commit }, data) {
    commit('SET_NEW_WARMING_DATA', data)
  },
  setShowList({ commit }, list) {
    commit('SET_SHOW_LIST', list)
  },
  setPlayIndex({ commit }, index) {
    commit('SET_PLAY_INDEX', index)
  },
  setConnected({ commit }, status) {
    commit('SET_CONNECTED', status)
  },
  setOpens({ commit }, status) {
    commit('SET_OPENS', status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
