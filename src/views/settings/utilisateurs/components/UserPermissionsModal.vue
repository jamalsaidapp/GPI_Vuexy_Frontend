<template>
  <div>
    <b-modal
      ref="PermissionsModal"
      v-model="ModalSync"
      :title="title"
      centered
      ok-title="Enregistrer"
      cancel-title="Férmer"
      button-size="sm"
      size="md"
      no-close-on-backdrop
      @ok="submit"
    >
      <b-col md="12">
        <grouped-permissions
          :permissions="InitialPermissions"
          :checked-permissions="userPerms"
          :loading-perms="loadingPerms"
          :permissions-via-roles="permissionsViaRoles"
        />
      </b-col>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal, BCol,
} from 'bootstrap-vue'
import Form from 'vform'
import store from '@/store'
import { toastNotification } from '@/libs/toastification'
import GroupedPermissions from '@/views/settings/utilisateurs/components/GroupedPermissions'

const R = require('ramda')

export default {
  name: 'UserPermissionsModal',
  components: {
    BModal,
    BCol,

    GroupedPermissions,
  },
  data() {
    return {
      ModalSync: false,
      title: 'Modification Des Permissions',
      loadingPerms: false,
      form: new Form({
        id: '',
        permissions: [],
      }),
      InitialPermissions: [],
      userPerms: [],
      permissionsViaRoles: [],
    }
  },
  computed: {
    permsResource() {
      return R.uniq(R.pluck('subject')(this.InitialPermissions))
    },
  },
  created() {
    this.$root.$on('user-permissions-modal-sync', id => {
      this.form.clear()
      this.form.reset()
      this.form.id = id
      this.getUserPermissions(id)
      this.ModalSync = !this.ModalSync
    })
    this.$root.$on('on-permissions-change', permissions => {
      this.form.permissions = permissions
    })
  },
  methods: {
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.setUserPermissions()
    },
    async getUserPermissions() {
      this.loadingPerms = true
      await store.dispatch('permissionsStore/getUserPermissions', this.form.id).then(res => {
        this.form.permissions = R.pluck('name')(res.data.permissions)
        this.userPerms = R.pluck('name')(res.data.permissions)
        this.permissionsViaRoles = res.data.permissionsViaRoles
        this.InitialPermissions = res.data.initialPerms
        this.loadingPerms = false
      })
    },
    setUserPermissions() {
      store.dispatch('permissionsStore/setUserPermissions', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            toastNotification(res.data.msg, 'Key', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
  },

}
</script>

<style lang="scss">

</style>
