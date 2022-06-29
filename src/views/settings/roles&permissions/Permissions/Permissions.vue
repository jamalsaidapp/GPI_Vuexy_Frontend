<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        table-name="permissions"
        :table-data="permissions"
        :columns="columns"
        :is-loading="loading"
        :menu-options="menuOptions"
        :actions-buttons="actionsButtons"
        @selected-row=" row => selectedRow = row "
      />
    </b-card>
    <PermissionsModal :subject="Subject" />
  </div>
</template>

<script>
import {
  BCard,
} from 'bootstrap-vue'
import store from '@/store'
import { mapGetters } from 'vuex'
import PermissionsModal from './PermissionsModal'

const R = require('ramda')

export default {
  name: 'Index',
  components: {
    BCard,
    PermissionsModal,
  },
  data() {
    return {
      columns: [
        {
          field: 'id',
          header: 'ID',
          sortable: true,
        },
        {
          field: 'name',
          header: 'Nom',
          sortable: true,
        },
        {
          field: 'subject',
          header: 'Resource',
          sortable: true,
        },
        {
          field: 'action',
          header: 'Permission',
          sortable: true,
        },
      ],
      selectedRow: null,
      menuOptions: [
        {
          label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenPermissionModal(this.selectedRow), perms: this.$can('update', 'permissions'),
        },
        {
          label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.deletePermissions(this.selectedRow.id), perms: this.$can('delete', 'roles'),
        },
      ],
      actionsButtons: [
        {
          variant: 'gradient-primary', icon: 'PlusIcon', command: () => this.OpenPermissionModal(), perms: this.$can('create', 'permissions'),
        },
        {
          variant: 'gradient-secondary', icon: 'RefreshCwIcon', command: () => this.fetchPermissions(),
        },
      ],
      Subject: [],
    }
  },
  computed: {
    ...mapGetters({
      permissions: 'permissionsStore/getPermissions',
      loading: 'permissionsStore/getLoading',
    }),
  },
  async created() {
    await this.fetchPermissions()
  },

  methods: {
    fetchPermissions() {
      store.dispatch('permissionsStore/fetchPermissions').then(() => {
        this.Subject = R.pluck('subject')(this.permissions)
      })
    },
    OpenPermissionModal(data) {
      this.$root.$emit('permissions-modal', data)
    },
    deletePermissions(val) {
      console.log(val)
    },
  },
}
</script>

<style scoped>

</style>
