<template>
  <div class="misc-wrapper">
    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <h2 class="mb-1">
          You are not authorized! 🔐
        </h2>
        <p class="mb-2">
          You don’t have permission to access this page. Go Home!!
        </p>
        <b-button
          variant="primary"
          class="mb-1 mr-2 btn-sm-block"
          :to="loginRoute()"
        >Accueil</b-button>
        <b-button
          variant="primary"
          class="mb-1 btn-sm-block"
          @click="logout()"
        >Se Déconnecter</b-button>
        <b-img
          fluid
          :src="imgUrl"
          alt="Not authorized page"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { BImg, BButton } from 'bootstrap-vue'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import useJwt from '@/auth/jwt/useJwt'
import { initialAbility } from '@/libs/acl/config'

export default {
  components: {
    BImg,
    BButton,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/not-authorized.svg'),
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/not-authorized-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
  methods: {
    loginRoute() {
      const user = JSON.parse(localStorage.getItem('userData'))
      return getHomeRouteForLoggedInUser(user ? user.role : null)
    },
    logout() {
      useJwt.logout().then(() => {
        useJwt.deleteToken()
        localStorage.removeItem('userData')
        this.$ability.update(initialAbility)
        this.$router.push({
          name: 'auth-login',
        })
      })
    },
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-misc.scss";
</style>
