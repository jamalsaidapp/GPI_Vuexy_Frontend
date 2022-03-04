import axios from '@axios'

export default {
    namespaced: true,
    state: {
        ordinateurs: [],
        loading: false,
    },
    getters: {
        getOrdinateurs(state) {
            return state.ordinateurs
        },
        getLoading(state) {
            return state.loading
        },
    },
    mutations: {
        SET_Ordinateurs(state, ApiOrdinateurs) {
            state.ordinateurs = ApiOrdinateurs
        },
        SET_LOADING_TRUE(state) {
            state.loading = true
        },
        SET_LOADING_FALSE(state) {
            state.loading = false
        },
    },
    actions: {
        fetchOrdinateurs({ commit }) {
            commit('SET_LOADING_TRUE')
            return new Promise((resolve, reject) => {
                axios.get('api/ordinateurs')
                    .then(res => {
                        resolve(res)
                        if (res.data) commit('SET_Ordinateurs', res.data)
                        commit('SET_LOADING_FALSE')
                    })
                    .catch(error => {
                        reject(error)
                        commit('SET_LOADING_FALSE')
                    })
            })
        },
        // eslint-disable-next-line no-unused-vars
        addOrdinateur({ dispatch }, form) {
            return new Promise((resolve, reject) => {
                form.post('api/ordinateurs')
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchOrdinateurs')
                    })
                    .catch(error => reject(error))
            })
        },
        editOrdinateur({ dispatch }, form) {
            return new Promise((resolve, reject) => {
                form.put(`api/ordinateurs/${form.id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchOrdinateurs')
                    })
                    .catch(error => reject(error))
            })
        },
        deleteOrdinateur({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios.delete(`api/ordinateurs/${id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchOrdinateurs')
                    })
                    .catch(error => reject(error))
            })
        },
        restoreOrdinateur({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios.post(`api/restore_ordinateur/${id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchOrdinateurs')
                    })
                    .catch(error => reject(error))
            })
        },
    },
}
