<template>

  <b-card class="r_p">
    <b-tabs
      content-class="mt-1"
      style="border: 1px solid #c0c4cc;"
    >
      <b-tab title="Gestion des Rôles">
        <roles />
      </b-tab>
      <b-tab title="Gestion des Permissions">
        <permissions />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import {
  BCard, BTabs, BTab,
} from 'bootstrap-vue'
import roles from './Roles/Roles'
import permissions from './Permissions/Permissions'

export default {
  name: 'RolesPermissions',
  components: {
    roles,
    permissions,
    BCard,
    BTabs,
    BTab,
  },
  created() {
  },

}
</script>

<style >
.r_p .nav-tabs {
  /*margin-bottom: -1.12rem !important;*/
}

</style>
