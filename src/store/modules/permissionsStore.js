import axios from '@axios'

export default {
  namespaced: true,
  state: {
    permissions: [],
    loading: false,
  },
  getters: {
    getPermissions(state) {
      return state.permissions
    },
    getLoading(state) {
      return state.loading
    },
  },
  mutations: {
    SET_PERMISSIONS(state, ApiPermissions) {
      state.permissions = ApiPermissions
    },
    SET_LOADING_TRUE(state) {
      state.loading = true
    },
    SET_LOADING_FALSE(state) {
      state.loading = false
    },
  },
  actions: {
    fetchPermissions({ commit }) {
      commit('SET_LOADING_TRUE')
      return axios.get('api/permissions')
        .then(({ data }) => {
          if (data) commit('SET_PERMISSIONS', data)
          commit('SET_LOADING_FALSE')
        })
        .catch(() => { commit('SET_LOADING_FALSE') })
    },
    addPermission({ dispatch }, form) {
      return form.post('api/permissions')
        .then(() => { if (form.successful) dispatch('fetchPermissions') })
    },
    editPermission({ dispatch }, form) {
      return form.put(`api/permissions/${form.id}`)
        .then(() => { if (form.successful) dispatch('fetchPermissions') })
    },
    deletePermission({ dispatch }, id) {
      return axios.delete(`api/permissions/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchPermissions') })
    },
    getUserPermissions({ }, id) {
      return axios.get(`api/permissions/${id}`)
    },
    setUserPermissions({ }, form) {
      return form.post(`api/set_user_permissions/${form.id}`)
    },
  },
}
