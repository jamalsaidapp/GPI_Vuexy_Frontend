import axios from '@axios'

export default {
  namespaced: true,
  state: {
    salaries: [],
    loading: false,
  },
  getters: {
    getSalaries(state) {
      return state.salaries
    },
    getLoading(state) {
      return state.loading
    },
  },
  mutations: {
    SET_Salaries(state, ApiSalaries) {
      state.salaries = ApiSalaries
    },
    SET_LOADING_TRUE(state) {
      state.loading = true
    },
    SET_LOADING_FALSE(state) {
      state.loading = false
    },
  },
  actions: {
    fetchSalaries({ commit }) {
      commit('SET_LOADING_TRUE')
      return axios.get('api/salaries')
        .then(res => {
          if (res.data) {
            commit('SET_Salaries', res.data)
            commit('SET_LOADING_FALSE')
          }
        })
        .catch(() => { commit('SET_LOADING_FALSE') })
    },
    // eslint-disable-next-line no-unused-vars
    addSalary({ dispatch }, form) {
      return form.post('api/salaries')
        .then(() => { if (form.successful) dispatch('fetchSalaries') })
    },
    editSalary({ dispatch }, form) {
      return form.put(`api/salaries/${form.id}`)
        .then(() => { if (form.successful) dispatch('fetchSalaries') })
    },
    deleteSalary({ dispatch }, id) {
      return axios.delete(`api/salaries/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchSalaries') })
    },
    restoreSalary({ dispatch }, id) {
      return axios.post(`api/restore_salary/${id}`)
        .then(({ status }) => { if (status === 200) dispatch('fetchSalaries') })
    },
    get_SN_Salaries() {
      return axios.get('api/get_sn_salaries')
    },
  },
}
