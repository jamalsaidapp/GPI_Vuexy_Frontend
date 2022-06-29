import axios from '@axios'

export default {
  namespaced: true,
  state: {
    users: [],
    loading: false,
  },
  getters: {
    getUsers(state) {
      return state.users
    },
    getLoading(state) {
      return state.loading
    },
  },
  mutations: {
    SET_USERS(state, ApiUsers) {
      state.users = ApiUsers
    },
    SET_LOADING_TRUE(state) {
      state.loading = true
    },
    SET_LOADING_FALSE(state) {
      state.loading = false
    },
  },
  actions: {
    fetchUsers({ commit }) {
      commit('SET_LOADING_TRUE')
      return axios.get('api/users')
        .then(({ data }) => {
          if (data) commit('SET_USERS', data)
          commit('SET_LOADING_FALSE')
        })
        .catch(() => {
          commit('SET_LOADING_FALSE')
        })
    },
    addUser({ dispatch }, form) {
      return form.post('api/users')
        .then(() => { if (form.successful) dispatch('fetchUsers') })
    },
    editUser({ dispatch }, form) {
      return form.put(`api/users/${form.id}`)
        .then(() => { if (form.successful)dispatch('fetchUsers') })
    },

    deleteUser({ dispatch }, id) {
      return axios.delete(`api/users/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchUsers') })
    },
    restoreUser({ dispatch }, id) {
      return axios.post(`api/restore_user/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchUsers') })
    },
  },
}
