<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        :table-name="tableName"
        :table-data="laptops"
        :selected-rows="selectedRows"
        :columns="columns"
        :is-loading="loading"
        :has-actions="false"
        has-deleted-filter
        :menu-options="menuOptions"
        :actions-buttons="actionsButtons"
        @selected-row=" row => selectedRow = row "
      />
    </b-card>
    <LaptopModal :table-name="tableName" />
  </div>
</template>

<script>

import { BCard } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import LaptopModal from '@/views/gestion_pc/laptops/LaptopModal'
import { ConfirmDelete, ConfirmRestore } from '@/libs/sweet-alerts'

export default {
  name: 'LaptopsTable',
  components: {
    BCard,
    LaptopModal,
  },
  data() {
    return {
      tableName: 'laptops',
      columns: [
        {
          field: 'marque',
          header: 'Marque',
          sortable: true,
        },
        {
          field: 'reference',
          header: 'Réference',
          sortable: true,
        },
        {
          field: 'sn',
          header: 'Numéro Serie',
          sortable: true,
        },
        {
          field: 'processor',
          header: 'Processeur',
          sortable: true,
        },
        {
          field: 'ram',
          header: 'RAM',
          sortable: true,
        },
        {
          field: 'disk',
          header: 'Disque Dur',
          sortable: true,
        },
        {
          field: 'state',
          header: 'Etat Du PC',
          sortable: true,
        },
        {
          field: 'affecter',
          header: 'Affecter',
          sortable: true,
        },
      ],
      selectedRows: [],
      selectedRow: null,
      menuOptions: [
        {
          label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenLaptopModal(this.selectedRow), permission: 'create',
        },
        {
          label: 'Dupliquer', icon: 'pi pi-fw pi-copy', command: () => this.DuplicateRow(this.selectedRow), permission: 'create',
        },
        {
          label: 'Restaurer', icon: 'pi pi-fw pi-refresh', command: () => this.restoreLaptop(this.selectedRow.id), permission: 'restore',
        },
        {
          label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.deleteLaptop(this.selectedRow.id), permission: 'delete',
        },
      ],
      actionsButtons: [
        {
          variant: 'gradient-primary', icon: 'PlusIcon', command: () => this.OpenLaptopModal(), permission: 'create',
        },
        {
          variant: 'gradient-secondary', icon: 'RefreshCwIcon', command: () => this.fetchLaptops(), permission: 'read',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      laptops: 'laptopsStore/getLaptops',
      loading: 'laptopsStore/getLoading',
    }),
  },
  async created() {
    await this.fetchLaptops()
  },
  methods: {
    fetchLaptops() {
      if (this.$can('read', this.tableName)) {
        store.dispatch('laptopsStore/fetchLaptops')
      }
    },
    deleteLaptop(id) {
      if (this.$can('delete', this.tableName)) {
        ConfirmDelete('laptopsStore/deleteLaptop', id)
      }
    },
    restoreLaptop(id) {
      if (this.$can('restore', this.tableName)) {
        ConfirmRestore('laptopsStore/restoreLaptop', id)
      }
    },
    OpenLaptopModal(laptop) {
      this.$root.$emit('laptop-modal-sync', laptop)
    },
    DuplicateRow(laptop) {
      this.$root.$emit('duplicate-row', laptop)
    },
  },
}
</script>

<style scoped>

</style>
