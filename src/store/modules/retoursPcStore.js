import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    retours: [],
    loading: false,
  },
  getters: {
    getRetours(state) {
      return state.retours
    },
    getLoading(state) {
      return state.loading
    },
  },
  mutations: {
    SET_Retours(state, ApiRetours) {
      state.retours = ApiRetours
    },
    SET_LOADING_TRUE(state) {
      state.loading = true
    },
    SET_LOADING_FALSE(state) {
      state.loading = false
    },
  },
  actions: {
    fetchRetours({ commit }) {
      commit('SET_LOADING_TRUE')
      return axios.get('api/retours')
        .then(({ data }) => {
          if (data) commit('SET_Retours', data)
          commit('SET_LOADING_FALSE')
        })
        .catch(() => {
          commit('SET_LOADING_FALSE')
        })
    },
    // eslint-disable-next-line no-unused-vars
    addReturn({ dispatch }, form) {
      return form.post('api/retours')
        .then(() => {
          if (form.successful) dispatch('affectationsPcStore/fetchAffectations', {}, { root: true })
          dispatch('laptopsStore/fetchLaptops', {}, { root: true })
        })
    },
    editReturn({ dispatch }, form) {
      return form.put(`api/retours/${form.salary_id}`)
        .then(() => {
          if (form.successful) dispatch('fetchRetours')
          dispatch('laptopsStore/fetchLaptops', {}, { root: true })
        })
    },
    deleteReturn({ dispatch }, data) {
      const { pivot } = data
      return axios.delete(`api/retours/${data.id}`, { data: pivot })
        .then(({ status }) => {
          if (status === 200) dispatch('fetchRetours')
          dispatch('laptopsStore/fetchLaptops', {}, { root: true })
        })
    },
  },
}
