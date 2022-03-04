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
            return new Promise((resolve, reject) => {
                return  axios.get('api/salaries')
                    .then(res => {
                        resolve(res)
                        if (res.data) commit('SET_Salaries', res.data)
                        commit('SET_LOADING_FALSE')
                    })
                    .catch(error => {
                        reject(error)
                        commit('SET_LOADING_FALSE')
                    })
            })
        },
        // eslint-disable-next-line no-unused-vars
        addSalarie({ dispatch }, form) {
            return new Promise((resolve, reject) => {
                form.post('api/salaries')
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchSalaries')
                    })
                    .catch(error => reject(error))
            })
        },
        editSalarie({ dispatch }, form) {
            return new Promise((resolve, reject) => {
                form.put(`api/salaries/${form.id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchSalaries')
                    })
                    .catch(error => reject(error))
            })
        },
        deleteSalarie({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios.delete(`api/salaries/${id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchSalaries')
                    })
                    .catch(error => reject(error))
            })
        },
        get_SN_Salaries() {
            return new Promise((resolve, reject) => {
                return  axios.get('api/get_sn_salaries')
                    .then(res => {
                        resolve(res)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
    },
}
