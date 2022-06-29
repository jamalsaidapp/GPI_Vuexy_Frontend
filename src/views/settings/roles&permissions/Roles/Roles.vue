<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        table-name="roles"
        :table-data="roles"
        :columns="columns"
        :is-loading="loading"
        :menu-options="menuOptions"
        :actions-buttons="actionsButtons"
        @selected-row=" row => selectedRow = row "
      />
    </b-card>
    <RoleModal :initial-permissions="perms" />
  </div>
</template>

<script>
import {
  BCard,
} from 'bootstrap-vue'
import store from '@/store'
import { mapGetters } from 'vuex'
import { ConfirmDelete } from '@/libs/sweet-alerts'
import RoleModal from './RoleModal'

export default {
  name: 'Index',
  components: {
    BCard,
    RoleModal,
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
          field: 'permissions_count',
          header: 'Nbr Permissions',
        },
      ],
      selectedRow: null,
      menuOptions: [
        {
          label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenRoleModal(this.selectedRow), perms: this.$can('update', 'roles'),
        },
        {
          label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.deleteRole(this.selectedRow.id), perms: this.$can('delete', 'roles'),
        },
      ],
      actionsButtons: [
        {
          variant: 'gradient-primary', icon: 'PlusIcon', command: () => this.OpenRoleModal(), perms: this.$can('create', 'roles'),
        },
        {
          variant: 'gradient-secondary', icon: 'RefreshCwIcon', command: () => this.fetchRoles(),
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      roles: 'rolesStore/getRoles',
      loading: 'rolesStore/getLoading',
      perms: 'permissionsStore/getPermissions',
    }),
  },
  async created() {
    await this.fetchRoles()
  },

  methods: {
    fetchRoles() {
      store.dispatch('rolesStore/fetchRoles')
    },
    OpenRoleModal(role) {
      this.$root.$emit('role-modal-sync', role)
    },
    deleteRole(id) {
      ConfirmDelete('rolesStore/deleteRole', id)
    },
  },
}
</script>

<style scoped>

</style>
