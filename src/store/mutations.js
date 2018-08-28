import * as types from './mutations-type'
import Vue from 'vue'

const mutations = {
  [types.SET_KINDS] (state, data) {
    console.log(data.index + '~' + data.id)
    state.kinds[data.index] = data.id
  },
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    Vue.set(state, 'playlist', list) // 触发状态更新， 也可以用这种方式。
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST] (state, topList) {
    state.topList = topList
  },
  [types.SET_QUERY] (state, query) {
    state.query = query
  },
  [types.SET_SEARCH_HISTORY] (state, searchHistory) {
    state.searchHistory = searchHistory
  }
}
export default mutations
