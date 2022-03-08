<template>
  <b-card
      no-body
      class="p-1"
  >
    <JDatatable
        table-name="Utilisateur"
        :table-data="users"
        :columns="columns"
        :custom-cols="customCols"
        :isloading="loading"
        has-export
        has-selection
        @selected-rows="newValue => selectedRows = newValue"
        @delete-all="ids => deleteUser(ids)"
        @export-excel="exportExcel"
        has-deleted-filter
    >
      <template #action_table>
        <b-button
            variant="gradient-secondary"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="fetchUsers"
        >
          <feather-icon icon="RefreshCwIcon"/>
        </b-button>
        <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            size="sm"
            @click="OpenUserModal(null)"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
      </template>

      <template #custom_cols="{ props ,field }">
        <CustomCols :field="field" :slot-props="props"/>
      </template>

      <template #actions_button="props">
        <b-button
            variant="gradient-success"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="OpenUserModal(props.props)"
        >
          <feather-icon icon="EditIcon"/>
        </b-button>
        <b-button
            variant="gradient-warning"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="OpenUserPermissionsModal(props.props.id)"
        >
          <feather-icon icon="KeyIcon"/>
        </b-button>
        <b-button
            v-if="!props.props.deleted_at"
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            size="sm"
            @click="deleteUser(props.props.id)"
        >
          <feather-icon icon="Trash2Icon"/>
        </b-button>
        <b-button v-else
                  variant="gradient-primary"
                  class="btn-icon rounded-circle"
                  size="sm"
                  @click="restoreUser(props.props.id)"
        >
          <feather-icon icon="CornerRightUpIcon"/>
        </b-button>
      </template>
    </JDatatable>
    <UserModal/>
    <UserPermissionsModal/>
  </b-card>
</template>

<script>
import { BCard, BButton } from 'bootstrap-vue'
import CustomCols from "./components/CustomCols";
import JDatatable from "@/myCompenents/JDatatable";
import {mapGetters} from "vuex";
import store from "@/store";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import UserModal from "./components/UserModal";
import UserPermissionsModal from "./components/UserPermissionsModal";

export default {
  name: "index",
  components: {
    BCard,
    BButton,
    CustomCols,
    JDatatable,
    UserModal,
    UserPermissionsModal,
    ToastificationContent
  },
  data() {
    return {
      tableName: 'userTable',
      columns: [
        {field: 'id', header: 'ID', sortable: true},
        {field: 'first_name', header: 'Nom', sortable: true},
        {field: 'last_name', header: 'Prénom', sortable: true},
        {field: 'email', header: 'Email', sortable: true},
        {field: 'created_at', header: 'Date Création', sortable: true},
      ],
      customCols: [
        {field: 'status', header: 'Status', sortable: true},
        {field: 'role', header: 'Role', sortable: true},
      ],
      selectedRows: [],
      filters: {},
      tableData: [],
    }
  },
  computed: {
    ...mapGetters({
      users: 'usersStore/getUsers',
      loading: 'usersStore/getLoading',
    }),
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
      store.dispatch('usersStore/deleteUser', id).then(res => {
        this.$nextTick(() => {
          if (res.data.msg) {
            this.toastNotification(res.data.msg, 'Trash2', 'success')
          }
        })
      })
    },
    restoreUser(id) {
      store.dispatch('usersStore/restoreUser', id).then(res => {
        this.$nextTick(() => {
          if (res.data.msg) {
            this.toastNotification(res.data.msg, 'CornerRightUp', 'success')
          }
        })
      })
    },
    exportExcel() {
      console.log('export')
    },
    toastNotification(text, icon, variant) {
      this.$toast({
            component: ToastificationContent,
            props: {
              text,
              icon: `${icon}Icon`,
              variant,
            },
          },
          {
            position: 'top-center',
          })
    },
  },
}
</script>

<style scoped>

</style>
