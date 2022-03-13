import { $themeConfig } from '@themeConfig'

export default {
  namespaced: true,
  state: {
    isVerticalMenuCollapsed: JSON.parse(localStorage.getItem('isVerticalMenuCollapsed')) || $themeConfig.layout.menu.isCollapsed,
  },
  getters: {},
  mutations: {
    UPDATE_VERTICAL_MENU_COLLAPSED(state, val) {
      localStorage.setItem('isVerticalMenuCollapsed', JSON.stringify(val))
      state.isVerticalMenuCollapsed = val
    },
  },
  actions: {},
}
