import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    affectations: [],
    loading: false,
  },
  getters: {
    getAffectations(state) {
      return state.affectations
    },
    getLoading(state) {
      return state.loading
    },
  },
  mutations: {
    SET_Affectations(state, ApiAffectations) {
      state.affectations = ApiAffectations
    },
    SET_LOADING_TRUE(state) {
      state.loading = true
    },
    SET_LOADING_FALSE(state) {
      state.loading = false
    },
  },
  actions: {
    fetchAffectations({ commit }) {
      commit('SET_LOADING_TRUE')
      return new Promise((resolve, reject) => {
        axios.get('api/affectations')
          .then(res => {
            resolve(res)
            if (res.data) commit('SET_Affectations', res.data)
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
        form.post('api/affectations')
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchAffectations')
            dispatch('ordinateursStore/fetchOrdinateurs', {}, { root: true })
          })
          .catch(error => reject(error))
      })
    },
    editAffectation({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        form.put(`api/affectations/${form.salarie_id}`)
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchAffectations')
            dispatch('ordinateursStore/fetchOrdinateurs', {}, { root: true })
          })
          .catch(error => reject(error))
      })
    },
    deleteAffectation({ dispatch }, data) {
      const { pivot } = data
      return new Promise((resolve, reject) => {
        axios.delete(`api/affectations/${data.id}`, { data: pivot })
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchAffectations')
            dispatch('ordinateursStore/fetchOrdinateurs', {}, { root: true })
          })
          .catch(error => reject(error))
      })
    },
  },
}
