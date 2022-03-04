import axios from '@axios'

export default {
    namespaced: true,
    state: {
        roles: [],
        loading: false,
    },
    getters: {
        getRoles(state) {
            return state.roles
        },
        getLoading(state) {
            return state.loading
        },
    },
    mutations: {
        SET_Roles(state, ApiRoles) {
            state.roles = ApiRoles
        },
        SET_LOADING_TRUE(state) {
            state.loading = true
        },
        SET_LOADING_FALSE(state) {
            state.loading = false
        },
    },
    actions: {
        fetchRoles({ commit }) {
            commit('SET_LOADING_TRUE')
            return new Promise((resolve, reject) => {
                axios.get('api/roles')
                    .then(res => {
                        resolve(res)
                        if (res.data) commit('SET_Roles', res.data)
                        commit('SET_LOADING_FALSE')
                    })
                    .catch(error => {
                        reject(error)
                        commit('SET_LOADING_FALSE')
                    })
            })
        },
        // eslint-disable-next-line no-unused-vars
        addRole({ dispatch }, form) {
            return new Promise((resolve, reject) => {
                form.post('api/roles')
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchRoles')
                    })
                    .catch(error => reject(error))
            })
        },
        editRole({ dispatch }, form) {
            return new Promise((resolve, reject) => {
                form.put(`api/roles/${form.id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchRoles')
                    })
                    .catch(error => reject(error))
            })
        },
        deleteRole({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios.delete(`api/roles/${id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchRoles')
                    })
                    .catch(error => reject(error))
            })
        },
    },
}
