<template>
  <b-card
    no-body
    class="p-1"
  >
    <JDatatable
      :table-name="tableName"
      :table-data="users"
      :columns="columns"
      :is-loading="loading"
      has-export
      has-selection
      has-deleted-filter
      :has-actions="false"
      :menu-options="menuOptions"
      :has-filter="true"
      @selected-rows="newValue => selectedRows = newValue"
      @delete-all="ids => deleteUser(ids)"
      @export-excel="exportExcel"
      @selected-row="row => selectedRow = row "
    >
      <template #action_table>
        <b-button
          variant="gradient-primary"
          class="btn-icon rounded-circle mr-1"
          size="sm"
          @click="OpenUserModal(null)"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
        <b-button
          variant="gradient-secondary"
          class="btn-icon rounded-circle mr-1"
          size="sm"
          @click="fetchUsers"
        >
          <feather-icon icon="RefreshCwIcon" />
        </b-button>
      </template>

    </JDatatable>
    <UserModal />
    <UserPermissionsModal />
  </b-card>
</template>

<script>
import { BCard, BButton } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import { ConfirmDelete, ConfirmRestore } from '@/libs/sweet-alerts'
import CustomCols from './components/CustomCols'
import UserModal from './components/UserModal'
import UserPermissionsModal from './components/UserPermissionsModal'

export default {
  name: 'Utilisateurs',
  components: {
    BCard,
    BButton,
    UserModal,
    UserPermissionsModal,
  },
  data() {
    return {
      tableName: 'userTable',
      columns: [
        {
          field: 'id', header: 'ID', sortable: true,
        },
        {
          field: 'first_name', header: 'Nom', sortable: true, filtered: false,
        },
        {
          field: 'last_name', header: 'Prénom', sortable: true,
        },
        { field: 'email', header: 'Email', sortable: true },
        {
          field: 'created_at', header: 'Date Création', sortable: true,
        },
        {
          field: 'status', header: 'Status', sortable: true, hasComponent: true, component: CustomCols,
        },
        {
          field: 'role', header: 'Role', sortable: true, hasComponent: true, component: CustomCols,
        },
      ],
      selectedRows: [],
      filters: {},
      tableData: [],
      selectedRow: null,
      menuOptions: [
        { label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenUserModal(this.selectedRow) },
        { label: 'Permissions', icon: 'pi pi-fw pi-key', command: () => this.OpenUserPermissionsModal(this.selectedRow.id) },
        {
          label: 'Restaurer', icon: 'pi pi-fw pi-refresh', command: () => this.restoreUser(this.selectedRow.id), visible: false,
        },
        { label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.deleteUser(this.selectedRow.id) },
      ],
    }
  },
  computed: {
    ...mapGetters({
      users: 'usersStore/getUsers',
      loading: 'usersStore/getLoading',
    }),
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    selectedRow(newValue, oldValue) {
      const menu = this.$children[0].$refs.cm
      if (menu) menu.model[2].visible = !(newValue?.deleted_at === null)
    },
  },
  async created() {
    await this.fetchUsers()
  },
  methods: {
    OpenUserModal(user) {
      this.$root.$emit('user-modal-sync', user)
    },
    OpenUserPermissionsModal(id) {
      this.$root.$emit('user-permissions-modal-sync', id)
    },
    fetchUsers() {
      store.dispatch('usersStore/fetchUsers')
    },
    deleteUser(id) {
      ConfirmDelete('usersStore/deleteUser', id)
    },
    restoreUser(id) {
      ConfirmRestore('usersStore/restoreUser', id)
    },
    exportExcel() {
      console.log('export')
    },
  },
}
</script>

<style scoped>

</style>
