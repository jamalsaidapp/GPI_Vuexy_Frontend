<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Login v1 -->
      <b-card class="mb-0">
        <!-- form -->
        <small
          v-if="error"
          class="text-danger m-auto"
        > {{ error }}</small>
        <b-form
          class="auth-login-form mt-2"
          @submit.prevent="login"
        >
          <!-- email -->
          <b-form-group
            label-for="email"
            label="Email"
          >
            <b-form-input
              id="email"
              v-model="form.email"
              name="login-email"
              placeholder="john@example.com"
              :state="form.errors.has('email') ? false : null"
              autofocus
              @input="clearFormError('email')"
            />
            <small class="text-danger">{{ form.errors.get("email") }}</small>
          </b-form-group>

          <!-- password -->
          <b-form-group>
            <div class="d-flex justify-content-between">
              <label for="password">Password</label>
              <b-link :to="{ name: 'auth-forgot-password-v1' }">
                <small>Forgot Password?</small>
              </b-link>
            </div>

            <b-input-group
              class="input-group-merge"
              :class="form.errors.has('password') ? 'is-invalid' : null"
            >
              <b-form-input
                id="password"
                v-model="form.password"
                :type="passwordFieldType"
                class="form-control-merge"
                name="login-password"
                placeholder="Password"
                :state="form.errors.has('password') ? false : null"
                @input="clearFormError('password')"
              />

              <b-input-group-append is-text>
                <feather-icon
                  class="cursor-pointer"
                  :icon="passwordToggleIcon"
                  @click="togglePasswordVisibility"
                />
              </b-input-group-append>
            </b-input-group>
            <small
              v-if="form.errors.has('password')"
              class="text-danger"
            >{{
              form.errors.get("password")
            }}</small>
          </b-form-group>

          <!-- checkbox -->
          <b-form-group>
            <b-form-checkbox
              id="remember-me"
              v-model="status"
              name="checkbox-1"
            >
              Remember Me
            </b-form-checkbox>
          </b-form-group>

          <!-- submit button -->
          <b-button
            variant="primary"
            type="submit"
            block
          >
            <div v-if="isLogin">
              <b-spinner small />
              <span class="ml-1">Connexion...</span>
            </div>
            <div v-else>
              <span>Se Connecter</span>
            </div>
          </b-button>
        </b-form>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div></template>

<script>
/* eslint-disable global-require */
import {
  BCard,
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BForm,
  BButton,
  BSpinner,
  VBTooltip,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import Form from 'vform'
// import { initialAbility } from '@/libs/acl/config'



// const R = require('ramda')
// :state="errors.length > 0 ? false:null"

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BCard,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BForm,
    BButton,
    BSpinner,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      isLogin: false,
      status: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),
      form: new Form({
        email: 'said.jamal@nomatis.com',
        password: 'jssjjamalsaid',
      }),
      error: '',
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    login() {
      this.isLogin = true
      this.form
        .post('api/login')
        .then(response => {
          const { userData } = response.data
          useJwt.setToken(response.data.accessToken)
          localStorage.setItem('userData', JSON.stringify(userData))
          this.$ability.update(userData.ability)
          this.$router.replace({ name: 'dashboard' })
          this.isLogin = false
        })
        .catch(error => {
          this.isLogin = false
          if (error)
          this.error = error.response.data.message
        })
    },
    clearFormError(field) {
      this.form.errors.clear(field)
      this.error = ''
    },
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
