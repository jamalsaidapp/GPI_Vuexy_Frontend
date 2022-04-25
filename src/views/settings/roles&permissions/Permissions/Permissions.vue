<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        table-name="Permission"
        :table-data="permissions"
        :selected-rows="selectedRows"
        :columns="columns"
        :isloading="loading"
      >
        <template #action_table>
          <b-button
            variant="gradient-secondary"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="fetchPermissions"
          >
            <feather-icon icon="RefreshCwIcon" />
          </b-button>
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            size="sm"
            @click="OpenPermissionModal"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </template>
        <template v-slot:actions_button="data">
          <b-button
            variant="gradient-success"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="OpenPermissionModal(data.props)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            size="sm"
            @click="log(data.props.id)"
          >
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </template>
      </JDatatable>
    </b-card>
    <PermissionsModal :subject="Subject" />
  </div>
</template>

<script>
import {
  BButton, BCard,
} from 'bootstrap-vue'
import store from '@/store'
import { mapGetters } from 'vuex'
import PermissionsModal from './PermissionsModal'

const R = require('ramda')

export default {
  name: 'Index',
  components: {
    BButton,
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
      selectedRows: [],
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
    log(val) {
      console.log(val)
    },
    OpenPermissionModal(permission) {
      this.$root.$emit('permissions-modal', permission)
    },
  },
}
</script>

<style scoped>

</style>
