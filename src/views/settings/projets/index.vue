<template>
  <b-card
    no-body
    class="p-1"
  >
    <JDatatable
      :table-name="tableName"
      :table-data="projets"
      :selected-rows="selectedRows"
      :columns="columns"
      :is-loading="loading"
      :menu-options="menuOptions"
      :actions-buttons="actionsButtons"
      @selected-rows="newValue => selectedRows = newValue"
      @selected-row="row => selectedRow = row "
    />
    <ProjetModal :table-name="tableName" />
  </b-card>
</template>

<script>
import { BCard } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import ProjetModal from '@/views/settings/projets/ProjetModal'
import { ConfirmDelete, ConfirmRestore } from '@/libs/sweet-alerts'

export default {
  name: 'Index',
  components: {
    BCard,
    ProjetModal,
  },
  data() {
    return {
      tableName: 'projets',
      columns: [
        {
          field: 'id',
          header: 'ID',
          sortable: true,
        },
        {
          field: 'name',
          header: 'Nom Projet',
          sortable: true,
        },
        {
          field: 'code',
          header: 'Code Projet',
          sortable: true,
        },

      ],
      selectedRows: [],
      selectedRow: null,
      menuOptions: [
        {
          label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenProjetModal(this.selectedRow), permission: 'update',
        },
        {
          label: 'Restaurer', icon: 'pi pi-fw pi-refresh', command: () => this.restoreProjet(this.selectedRow.id), permission: 'restore',
        },
        {
          label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.deleteProjet(this.selectedRow.id), permission: 'delete',
        },
      ],
      actionsButtons: [
        {
          variant: 'gradient-primary', icon: 'PlusIcon', command: () => this.OpenProjetModal(), permission: 'create',
        },
        {
          variant: 'gradient-secondary', icon: 'RefreshCwIcon', command: () => this.fetchProjets(), permission: 'read',
        },

      ],
    }
  },
  computed: {
    ...mapGetters({
      projets: 'projetsStore/getProjets',
      loading: 'projetsStore/getLoading',
    }),

  },
  async created() {
    await this.fetchProjets()
  },
  methods: {
    fetchProjets() {
      if (this.$can('read', this.tableName)) {
        store.dispatch('projetsStore/fetchProjets')
      }
    },
    OpenProjetModal(projet) {
      this.$root.$emit('projet-modal-sync', projet)
    },
    deleteProjet(id) {
      if (this.$can('delete', this.tableName)) {
        ConfirmDelete('projetsStore/deleteProjet', id)
      }
    },
    restoreProjet(id) {
      if (this.$can('restore', this.tableName)) {
        ConfirmRestore('projetsStore/restoreProjet', id)
      }
    },
  },
}
</script>

<style scoped>

</style>
