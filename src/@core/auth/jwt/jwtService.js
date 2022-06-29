import Axios from 'axios'
import Cookies from 'js-cookie'
import Vue from 'vue'

// eslint-disable-next-line import/no-cycle
import router from '@/router'
// // eslint-disable-next-line import/no-cycle
// import useJwt from '@/auth/jwt/useJwt'
import { initialAbility } from '@/libs/acl/config'
import ability from '@/libs/acl/ability'
import jwtDefaultConfig from './jwtDefaultConfig'

export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns = null

  // jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // For Refreshing Token
  subscribers = []

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      config => {
        // Get token from localStorage
        const accessToken = this.getToken()

        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
          Axios.defaults.headers.common.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error),
    )

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      response => {
        const { data } = response
        if (data.msg) {
          Vue.$toast.success(data.msg)
        }
        return Promise.resolve(response)
      },
      error => {
        // const { config, response: { status } } = error
        const { response: { status, data } } = error
        // eslint-disable-next-line no-unused-vars
        if (status === 401) {
          // if (!this.isAlreadyFetchingAccessToken) {
          //   this.isAlreadyFetchingAccessToken = true
          //   this.refreshToken().then(r => {
          //     this.isAlreadyFetchingAccessToken = false
          //
          //     // Update accessToken in localStorage
          //     this.setToken(r.data.accessToken)
          //     this.setRefreshToken(r.data.refreshToken)
          //
          //     this.onAccessTokenFetched(r.data.accessToken)
          //   })
          // }
          // const retryOriginalRequest = new Promise(resolve => {
          //   this.addSubscriber(accessToken => {
          //     // Make sure to assign accessToken according to your response.
          //     // Check: https://pixinvent.ticksy.com/ticket/2413870
          //     // Change Authorization header
          //     originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
          //     resolve(this.axiosIns(originalRequest))
          //   })
          // })
          // return retryOriginalRequest
          // localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
          this.deleteToken()
          localStorage.removeItem('userData')
          ability.update(initialAbility)
          router.replace({ name: 'auth-login' }).catch(() => {})
        }
        if (status === 403 && data.msg) {
          return Vue.$toast.error(data.msg)
        }
        return Promise.reject(error)
      },
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    // return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
    return Cookies.get((this.jwtConfig.storageTokenKeyName))
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    // localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
    Cookies.set(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  deleteToken() {
    Cookies.remove(this.jwtConfig.storageTokenKeyName)
  }

  login(...args) {
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args)
  }

  logout(...args) {
    return this.axiosIns.post(this.jwtConfig.logoutEndpoint, ...args)
  }

  register(...args) {
    return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return this.axiosIns.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    })
  }
}
