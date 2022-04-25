import axios from '@axios'
import { toastNotification } from '@/libs/toastification'

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
      return new Promise(resolve => {
        form.post('api/users').then(res => {
          resolve(res)
          if (res.data.msg) dispatch('fetchUsers')
        }).catch(error => {
          if (error.response.data.msg) toastNotification(error.response.data.msg, 'CheckIcon', error.response.data.variant)
        })
      })
    },
    editUser({ dispatch }, form) {
      return new Promise(resolve => {
        form.put(`api/users/${form.id}`).then(res => {
          resolve(res)
          if (res.data.msg) dispatch('fetchUsers')
        }).catch(error => {
          if (error.response.data.msg) toastNotification(error.response.data.msg, 'CheckIcon', error.response.data.variant)
        })
      })
    },

    deleteUser({ dispatch }, id) {
      return new Promise(resolve => {
        axios.delete(`api/users/${id}`).then(res => {
          resolve(res)
          console.log(res)
          if (res.data.msg) {
            dispatch('fetchUsers')
            toastNotification(res.data.msg, 'Trash2', res.data.variant)
          }
        }).catch(error => {
          toastNotification(error.response.data.msg, 'Trash2', error.response.data.variant)
        })
      })
    },
    restoreUser({ dispatch }, id) {
      return new Promise(resolve => {
        axios.post(`api/restore_user/${id}`)
          .then(res => {
            resolve(res)
            if (res.data.msg) dispatch('fetchUsers')
          }).catch(error => {
            toastNotification(error.response.data.msg, 'Trash2', error.response.data.variant)
          })
      })
    },
  },
}
