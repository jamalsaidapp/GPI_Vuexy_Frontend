<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        table-name="Salarie"
        :table-data="salaries"
        :selected-rows="selectedRows"
        :columns="columns"
        :isloading="loading"
        has-deleted-filter
        :has-actions="false"
        :menu-options="menuOptions"
        @selected-rows="newValue => selectedRows = newValue"
        @selected-row="row => selectedRow = row "
      >
        <template #action_table>
          <b-button
            variant="gradient-secondary"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="fetchSalaries"
          >
            <feather-icon icon="RefreshCwIcon" />
          </b-button>
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            size="sm"
            @click="OpenSalarieModal(null)"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </template>

      </JDatatable>
    </b-card>
    <SalarieModal />
  </div>
</template>

<script>
import { BButton, BCard } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import SalarieModal from '@/views/settings/salaries/SalarieModal'
import { toastNotification } from '@/libs/toastification'
import { ConfirmDelete } from '@/libs/sweet-alerts'

export default {
  name: 'Salaries',
  components: {
    BButton,
    BCard,
    SalarieModal,
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
          field: 'full_name',
          header: 'Nom Complete',
          sortable: true,
        },
        {
          field: 'ordinateurs_count',
          header: 'Nombre du PC Affecter',
          sortable: true,
        },
        {
          field: 'is_user',
          header: 'A un compte',
          sortable: true,
        },
        {
          field: 'created_by',
          header: 'Créer Par',
          sortable: true,
        },
        {
          field: 'updated_by',
          header: 'Modifier Par',
          sortable: true,
        },
      ],
      selectedRows: [],
      selectedRow: null,
      menuOptions: [
        { label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenSalarieModal(this.selectedRow) },
        {
          label: 'Restaurer', icon: 'pi pi-fw pi-refresh', command: () => this.restoreSalarie(this.selectedRow.id), visible: false,
        },
        { label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.deleteSalarie(this.selectedRow.id) },
      ],
    }
  },
  computed: {
    ...mapGetters({
      salaries: 'salariesStore/getSalaries',
      loading: 'salariesStore/getLoading',
    }),
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    selectedRow(newValue, oldValue) {
      const menu = this.$children[0].$refs.cm
      if (menu) menu.model[1].visible = !(newValue?.deleted_at === null)
    },
  },
  async created() {
    await this.fetchSalaries()
  },

  methods: {
    fetchSalaries() {
      store.dispatch('salariesStore/fetchSalaries')
    },
    OpenSalarieModal(salarie) {
      this.$root.$emit('salarie-modal-sync', salarie)
    },
    deleteSalarie(id) {
      ConfirmDelete('salariesStore/deleteSalarie', id)
    },
    restoreSalarie(id) {
      store.dispatch('salariesStore/restoreSalarie', id).then(res => {
        this.$nextTick(() => {
          if (res.data.msg) {
            toastNotification(res.data.msg, 'CornerRightUp', 'success')
          }
        })
      })
    },
  },
}
</script>

<style scoped>

</style>
