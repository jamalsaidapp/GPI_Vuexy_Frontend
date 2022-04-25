<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        table-name="Role"
        :table-data="roles"
        :selected-rows="selectedRows"
        :columns="columns"
        :isloading="loading"
      >
        <template #action_table>
          <b-button
            variant="gradient-secondary"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="fetchRoles"
          >
            <feather-icon icon="RefreshCwIcon" />
          </b-button>
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            size="sm"
            @click="OpenRoleModal(null)"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </template>

        <template v-slot:actions_button="props">
          <b-button
            variant="gradient-success"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="OpenRoleModal(props.props)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            size="sm"
            @click="deleteRole(props.props.id)"
          >
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </template>
      </JDatatable>
    </b-card>
    <RoleModal :initial-permissions="perms" />
  </div>
</template>

<script>
import {
  BButton, BCard,
} from 'bootstrap-vue'
import store from '@/store'
import { mapGetters } from 'vuex'
import { ConfirmDelete } from '@/libs/sweet-alerts'
import RoleModal from './RoleModal'

export default {
  name: 'Index',
  components: {
    BButton,
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
      ],
      selectedRows: [],
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
