import axios from '@axios'

export default {
    namespaced: true,
    state: {
        permissions: [],
        loading: false,
    },
    getters: {
        getPermissions(state) {
            return state.permissions
        },
        getLoading(state) {
            return state.loading
        },
    },
    mutations: {
        SET_PERMISSIONS(state, ApiPermissions) {
            state.permissions = ApiPermissions
        },
        SET_LOADING_TRUE(state) {
            state.loading = true
        },
        SET_LOADING_FALSE(state) {
            state.loading = false
        },
    },
    actions: {
        fetchPermissions({commit}) {
            commit('SET_LOADING_TRUE')
            return axios.get('api/permissions')
                .then(res => {
                    if (res.data) commit('SET_PERMISSIONS', res.data)
                    commit('SET_LOADING_FALSE')
                })
                .catch(e => {
                    console.log(e)
                    commit('SET_LOADING_FALSE')
                })
        },
        // eslint-disable-next-line no-unused-vars
        addPermission({dispatch}, form) {
            return new Promise((resolve, reject) => {
                form.post('api/permissions')
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchPermissions')
                    })
                    .catch(error => reject(error))
            })
        },
        editPermission({dispatch}, form) {
            return new Promise((resolve, reject) => {
                form.put(`api/permissions/${form.id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchPermissions')
                    })
                    .catch(error => reject(error))
            })
        },
        deletePermission({dispatch}, id) {
            return new Promise((resolve, reject) => {
                axios.delete(`api/permissions/${id}`)
                    .then(res => {
                        resolve(res)
                        if (res.data.msg) dispatch('fetchPermissions')
                    })
                    .catch(error => reject(error))
            })
        },
        getUserPermissions({ } ,id) {
            return new Promise((resolve, reject) => {
              axios.get(`api/permissions/${id}`)
                  .then(res => {resolve(res)})
                  .catch(error => reject(error))
            })
        },
        setUserPermissions({ } ,form) {
            return new Promise((resolve, reject) => {
                form.post(`api/set_user_permissions/${form.id}`)
                    .then(res => {resolve(res)})
                    .catch(error => reject(error))
            })
        },
    },
}
