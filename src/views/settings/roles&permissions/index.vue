<template>
  <div>
    <b-row>
      <b-col
          lg="6"
          md="12"
      >
        <roles/>
      </b-col>
      <b-col
          lg="6"
          md="12"
      >
        <permissions/>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import store from '@/store'
import roles from './Roles/Roles.vue'
import permissions from './Permissions/Permissions.vue'
import app_permissionsModule from "@/views/settings/roles&permissions/Permissions/permissionsStoreModule";
import app_rolesModule from "@/views/settings/roles&permissions/Roles/rolesStoreModule";

export default {
  name: 'RolesPermissions',
  components: {
    roles,
    permissions,
    BRow,
    BCol,
  },
  created() {
  },


}
</script>

<style scoped>

</style>
