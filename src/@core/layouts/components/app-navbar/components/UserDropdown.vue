<template>
  <b-nav-item-dropdown
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user"
  >
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p class="user-name font-weight-bolder mb-0">
          {{
            authUser.full_name
          }}
        </p>
        <span class="user-status">{{ authUser.role }}</span>
      </div>
      <b-avatar
        size="40"
        :src="authUser.avatar"
        variant="light-primary"
        badge
        class="badge-minimal"
        badge-variant="success"
      >
        <feather-icon
          v-if="!authUser.full_name"
          icon="UserIcon"
          size="22"
        />
      </b-avatar>
    </template>

    <b-dropdown-item
      :to="{ name: 'profile' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="UserIcon"
        class="mr-50"
      />
      <span>Profile</span>
    </b-dropdown-item>

    <b-dropdown-divider />

    <b-dropdown-item link-class="d-flex align-items-center">
      <feather-icon
        size="16"
        icon="SettingsIcon"
        class="mr-50"
      />
      <span>Settings</span>
    </b-dropdown-item>
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="logout"
    >
      <feather-icon
        size="16"
        icon="LogOutIcon"
        class="mr-50"
      />
      <span>Logout</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import {
  BNavItemDropdown,
  BDropdownItem,
  BDropdownDivider,
  BAvatar,
} from 'bootstrap-vue'
import { initialAbility } from '@/libs/acl/config'
import useJwt from '@/auth/jwt/useJwt'
import { avatarText } from '@core/utils/filter'

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
  },
  data() {
    return {
      avatarText,
    }
  },
  computed: {
    authUser() {
      return JSON.parse(localStorage.getItem('userData'))
    },
  },
  methods: {
    logout() {
      useJwt
        .logout()
        .then(() => {
          useJwt.deleteToken()
          localStorage.removeItem('userData')
          this.$ability.update(initialAbility)
          this.$router.push({ name: 'auth-login' })
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
}
</script>
