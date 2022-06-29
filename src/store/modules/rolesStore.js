import axios from '@axios'

export default {
  namespaced: true,
  state: {
    roles: [],
    loading: false,
  },
  getters: {
    getRoles(state) {
      return state.roles
    },
    getLoading(state) {
      return state.loading
    },
  },
  mutations: {
    SET_Roles(state, ApiRoles) {
      state.roles = ApiRoles
    },
    SET_LOADING_TRUE(state) {
      state.loading = true
    },
    SET_LOADING_FALSE(state) {
      state.loading = false
    },
  },
  actions: {
    fetchRoles({ commit }) {
      commit('SET_LOADING_TRUE')
      return axios.get('api/roles')
        .then(({ data }) => {
          if (data) commit('SET_Roles', data)
          commit('SET_LOADING_FALSE')
        })
        .catch(() => {
          commit('SET_LOADING_FALSE')
        })
    },
    addRole({ dispatch }, form) {
      return form.post('api/roles')
        .then(() => { if (form.successful) dispatch('fetchRoles') })
    },
    editRole({ dispatch }, form) {
      return form.put(`api/roles/${form.id}`)
        .then(() => { if (form.successful) dispatch('fetchRoles') })
    },
    deleteRole({ dispatch }, id) {
      return axios.delete(`api/roles/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchRoles') })
    },
  },
}
