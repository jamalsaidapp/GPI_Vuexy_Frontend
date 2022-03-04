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
            return new Promise((resolve, reject) => {
                axios.get('api/users')
                    .then(res => {
                        resolve(res)
                        if (res.data) commit('SET_USERS', res.data)
                        commit('SET_LOADING_FALSE')
                    })
                    .catch(error => {
                        reject(error)
                        commit('SET_LOADING_FALSE')
                    })
            })
        },
        addUser({ dispatch }, form) {
            return new Promise((resolve, reject) => {
                form.post('api/users').then(res => {
                    resolve(res)
                    if (res.data.msg) dispatch('fetchUsers')
                }).catch(error => reject(error))
            })
        },
        editUser({ dispatch }, form) {
            return new Promise((resolve, reject) => {
                form.put(`api/users/${form.id}`).then(res => {
                    resolve(res)
                    if (res.data.msg) dispatch('fetchUsers')
                }).catch(error => reject(error))
            })
        },
        deleteUser({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios.delete(`api/users/${id}`).then(res => {
                    resolve(res)
                    if (res.data.msg) dispatch('fetchUsers')
                }).catch(error => reject(error))
            })
        },
        restoreUser({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios.post(`api/restore_user/${id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchUsers')
                    })
                    .catch(error => reject(error))
            })
        },
    },
}
