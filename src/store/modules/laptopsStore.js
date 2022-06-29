import axios from '@axios'

export default {
  namespaced: true,
  state: {
    laptops: [],
    loading: false,
  },
  getters: {
    getLaptops(state) {
      return state.laptops
    },
    getLoading(state) {
      return state.loading
    },
  },
  mutations: {
    SET_Laptops(state, ApiLaptops) {
      state.laptops = ApiLaptops
    },
    SET_LOADING_TRUE(state) {
      state.loading = true
    },
    SET_LOADING_FALSE(state) {
      state.loading = false
    },
  },
  actions: {
    fetchLaptops({ commit }) {
      commit('SET_LOADING_TRUE')
      axios.get('api/laptops')
        .then(res => {
          if (res.data) {
            commit('SET_Laptops', res.data)
            commit('SET_LOADING_FALSE')
          }
        })
        .catch(() => { commit('SET_LOADING_FALSE') })
    },
    addLaptop({ dispatch }, form) {
      return form.post('api/laptops')
        .then(() => { if (form.successful) dispatch('fetchLaptops') })
    },
    editLaptop({ dispatch }, form) {
      return new Promise(resolve => {
        form.put(`api/laptops/${form.id}`)
          .then(res => {
            resolve(res)
            if (form.successful) dispatch('fetchLaptops')
          })
      })
    },
    deleteLaptop({ dispatch }, id) {
      return axios.delete(`api/laptops/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchLaptops') })
    },
    restoreLaptop({ dispatch }, id) {
      return axios.post(`api/restore_laptop/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchLaptops') })
    },
  },
}
