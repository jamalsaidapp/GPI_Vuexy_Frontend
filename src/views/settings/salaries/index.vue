<template>
  <b-card
    no-body
    class="p-1"
  >
    <JDatatable
      :table-name="tableName"
      :table-data="salaries"
      :selected-rows="selectedRows"
      :columns="columns"
      :is-loading="loading"
      :menu-options="menuOptions"
      :actions-buttons="actionsButtons"
      @selected-rows="newValue => selectedRows = newValue"
      @selected-row="row => selectedRow = row "
    />
    <SalarieModal :table-name="tableName" />
  </b-card>

</template>

<script>
import { BCard } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import SalarieModal from '@/views/settings/salaries/SalarieModal'
import { ConfirmDelete, ConfirmRestore } from '@/libs/sweet-alerts'
import xml2js from 'xml2js'

export default {
  name: 'Salaries',
  components: {
    BCard,
    SalarieModal,
  },
  data() {
    return {
      tableName: 'salaries',
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
          field: 'affected_laptops_count',
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

      ],
      selectedRows: [],
      selectedRow: null,
      menuOptions: [
        {
          label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenSalarieModal(this.selectedRow), permission: 'update',
        },
        {
          label: 'Restaurer', icon: 'pi pi-fw pi-refresh', command: () => this.restoreSalarie(this.selectedRow.id), permission: 'restore',
        },
        {
          label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.deleteSalarie(this.selectedRow.id), permission: 'delete',
        },
      ],
      actionsButtons: [
        {
          variant: 'gradient-primary', icon: 'PlusIcon', command: () => this.OpenSalarieModal(), permission: 'create',
        },
        {
          variant: 'gradient-secondary', icon: 'RefreshCwIcon', command: () => this.fetchSalaries(), permission: 'read',
        },
        {
          variant: 'outline-warning', icon: 'ArrowDownIcon', command: () => this.exportXML(), tooltip: 'Export Contact (.xml)', permission: 'export',
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
  async created() {
    await this.fetchSalaries()
  },
  methods: {
    fetchSalaries() {
      if (this.$can('read', this.tableName)) {
        store.dispatch('salariesStore/fetchSalaries')
      }
    },
    OpenSalarieModal(salary) {
      this.$root.$emit('salary-modal-sync', salary)
    },
    deleteSalarie(id) {
      if (this.$can('delete', this.tableName)) {
        ConfirmDelete('salariesStore/deleteSalary', id)
      }
    },
    restoreSalarie(id) {
      if (this.$can('restore', this.tableName)) {
        ConfirmRestore('salariesStore/restoreSalary', id)
      }
    },
    exportXML() {
      if (this.$can('manage', 'all')) {
        const AddressBook = [{ version: 1 }]
        this.salaries.filter(item => item.phone_fix !== '***')
          .map(item => ({
            id: item.phone_primary,
            name: item.full_name,
            phone: item.phone_fix,
          }))
          .forEach(item => {
            AddressBook.push(this.serializeContact(item))
          })
        const array = { AddressBook }
        const builder = new xml2js.Builder()
        const xml = builder.buildObject(array)
        const date = (new Date()).toLocaleDateString()
        if (xml) {
          this.downloadXML(xml, `Contacts_${date}.xml`)
        }
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
