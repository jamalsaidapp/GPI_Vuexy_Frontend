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
      return new Promise((resolve, reject) => {
        axios.get('api/retours')
          .then(res => {
            resolve(res)
            if (res.data) commit('SET_Retours', res.data)
            commit('SET_LOADING_FALSE')
          })
          .catch(error => {
            reject(error)
            commit('SET_LOADING_FALSE')
          })
      })
    },
    // eslint-disable-next-line no-unused-vars
    addAffectation({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        form.post('api/retours')
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchRetours')
            dispatch('ordinateursStore/fetchOrdinateurs', {}, { root: true })
          })
          .catch(error => reject(error))
      })
    },
    editAffectation({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        form.put(`api/retours/${form.salarie_id}`)
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchRetours')
            dispatch('ordinateursStore/fetchOrdinateurs', {}, { root: true })
          })
          .catch(error => reject(error))
      })
    },
    deleteAffectation({ dispatch }, data) {
      const { pivot } = data
      return new Promise((resolve, reject) => {
        axios.delete(`api/retours/${data.id}`, { data: pivot })
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchRetours')
            dispatch('ordinateursStore/fetchOrdinateurs', {}, { root: true })
          })
          .catch(error => reject(error))
      })
    },
  },
}
