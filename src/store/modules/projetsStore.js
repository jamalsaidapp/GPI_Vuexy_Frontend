import axios from '@axios'

export default {
  namespaced: true,
  state: {
    projets: [],
    loading: false,
  },
  getters: {
    getProjets(state) {
      return state.projets
    },
    getLoading(state) {
      return state.loading
    },
  },
  mutations: {
    SET_Projets(state, ApiProjets) {
      state.projets = ApiProjets
    },
    SET_LOADING_TRUE(state) {
      state.loading = true
    },
    SET_LOADING_FALSE(state) {
      state.loading = false
    },
  },
  actions: {
    fetchProjets({ commit }) {
      commit('SET_LOADING_TRUE')
      return new Promise((resolve, reject) => {
        axios.get('api/projets')
          .then(res => {
            resolve(res)
            if (res.data) commit('SET_Projets', res.data)
            commit('SET_LOADING_FALSE')
          })
          .catch(error => {
            reject(error)
            commit('SET_LOADING_FALSE')
          })
      })
    },
    // eslint-disable-next-line no-unused-vars
    addProjet({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        form.post('api/projets')
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchProjets')
          })
          .catch(error => reject(error))
      })
    },
    editProjet({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        form.put(`api/projets/${form.id}`)
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchProjets')
          })
          .catch(error => reject(error))
      })
    },
    deleteProjet({ dispatch }, id) {
      return new Promise((resolve, reject) => {
        axios.delete(`api/projets/${id}`)
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchProjets')
          })
          .catch(error => reject(error))
      })
    },
    restoreProjet({ dispatch }, id) {
      return new Promise((resolve, reject) => {
        axios.post(`api/restore_ordinateur/${id}`)
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchProjets')
          })
          .catch(error => reject(error))
      })
    },
  },
}
