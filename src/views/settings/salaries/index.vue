<template>
  <b-card
    no-body
    class="p-1"
  >
    <JDatatable
      table-name="Salarie"
      :table-data="salaries"
      :selected-rows="selectedRows"
      :columns="columns"
      :is-loading="loading"
      has-deleted-filter
      :has-actions="false"
      :menu-options="menuOptions"
      :refresh="fetchSalaries"
      :add-btn="OpenSalarieModal"
      :actions-buttons="actionsButtons"
      @selected-rows="newValue => selectedRows = newValue"
      @selected-row="row => selectedRow = row "
    />
    <SalarieModal />
  </b-card>

</template>

<script>
import { BCard } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import SalarieModal from '@/views/settings/salaries/SalarieModal'
import { toastNotification } from '@/libs/toastification'
import { ConfirmDelete } from '@/libs/sweet-alerts'
import xml2js from 'xml2js'

export default {
  name: 'Salaries',
  components: {
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
          field: 'cin',
          header: 'CIN',
          sortable: true,
        },
        {
          field: 'ordinateurs_count',
          header: 'N° PC Affecter',
          sortable: true,
        },
        {
          field: 'phone_fix',
          header: 'Fix N°',
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
      actionsButtons: [
        { variant: 'gradient-primary', icon: 'PlusIcon', command: () => this.OpenSalarieModal() },
        { variant: 'gradient-secondary', icon: 'RefreshCwIcon', command: () => this.fetchSalaries() },
        {
          variant: 'outline-warning', icon: 'ArrowDownIcon', command: () => this.exportXML(), tooltip: 'Export Contact (.xml)',
        },
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
    exportXML() {
      const AddressBook = [{ version: 1 }]
      this.salaries.filter(item => item.phone_fix !== '***')
        .map(item => ({ id: item.phone_primary, name: item.full_name, phone: item.phone_fix })).forEach(item => {
          AddressBook.push(this.serializeContact(item))
        })
      const array = { AddressBook }
      const builder = new xml2js.Builder()
      const xml = builder.buildObject(array)
      const date = (new Date()).toLocaleDateString()
      if (xml) {
        this.downloadXML(xml, `Contacts_${date}.xml`)
      }
    },
    serializeContact(contact) {
      return {
        Contact: [
          { FirstName: contact.name },
          { Primary: contact.id },
          {
            Phone: {
              $: { type: 'work' },
              phonenumber: contact.phone,
              accountindex: contact.id,
            },
          },
        ],
      }
    },
    downloadXML(xml, fileName) {
      const blob = new Blob([xml], { type: 'application/xml' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)
    },
  },
}
</script>

<style scoped>

</style>
