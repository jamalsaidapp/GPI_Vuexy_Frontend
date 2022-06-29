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
      return axios.get('api/projets')
        .then(({ data }) => {
          if (data) commit('SET_Projets', data)
          commit('SET_LOADING_FALSE')
        })
        .catch(() => {
          commit('SET_LOADING_FALSE')
        })
    },
    // eslint-disable-next-line no-unused-vars
    addProjet({ dispatch }, form) {
      return form.post('api/projets')
        .then(() => { if (form.successful) dispatch('fetchProjets') })
    },
    editProjet({ dispatch }, form) {
      return form.put(`api/projets/${form.id}`)
        .then(() => { if (form.successful) dispatch('fetchProjets') })
    },
    deleteProjet({ dispatch }, id) {
      return axios.delete(`api/projets/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchProjets') })
    },
    restoreProjet({ dispatch }, id) {
      return axios.post(`api/restore_ordinateur/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchProjets') })
    },
  },
}
