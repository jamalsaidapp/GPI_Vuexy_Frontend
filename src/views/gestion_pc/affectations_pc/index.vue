<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        table-name="Affectation"
        :table-data="affectations"
        :selected-rows="selectedRows"
        :columns="columns"
        :is-loading="loading"
        has-expansion
        :has-actions="false"
        data-key="sn"
        :menu-options="menuOptions"
        @selected-row="row => selectedRow = row "
      >
        <template #action_table>
          <b-button
            variant="gradient-secondary"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="fetchAffectations"
          >
            <feather-icon icon="RefreshCwIcon" />
          </b-button>
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            size="sm"
            @click="OpenAffectationModal(null)"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </template>

        <template
          v-slot:expand="{props}"
          class="ml-auto"
        >
          <ListOrdinateurAffecter :ordinateurs="props.ordinateur" />
        </template>

      </JDatatable>
    </b-card>
    <AffectationModal />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import {
  BButton, BCard,
} from 'bootstrap-vue'
import { ConfirmDelete } from '@/libs/sweet-alerts'
import AffectationModal from './components/AffectationModal'
import ListOrdinateurAffecter from './components/ListOrdinateurAffecter'

export default {
  name: 'AffectationsTable',
  components: {
    BButton,
    BCard,
    ListOrdinateurAffecter,
    AffectationModal,
  },
  data() {
    return {
      columns: [
        {
          field: 'full_name',
          header: 'Nom Complete',
          sortable: true,
        },
        {
          field: 'sn',
          header: 'Numéro Serie',
          sortable: true,
        },
        {
          field: 'projets',
          header: 'Projets',
          sortable: true,
        },
        {
          field: 'ordinateurs_count',
          header: 'Nombre du PC Affecter',
          sortable: true,
        },
      ],
      selectedRows: [],
      selectedRow: null,
    }
  },
  computed: {
    ...mapGetters({
      affectations: 'affectationsPcStore/getAffectations',
      loading: 'affectationsPcStore/getLoading',
    }),
    menuOptions() {
      return [
        { label: 'Imprimer', icon: 'pi pi-fw pi-print', command: () => this.print(this.selectedRow) },
        { label: 'Ordinateurs', icon: 'pi pi-fw pi-desktop', items: this.generateSubMenu() },
      ]
    },
    ordins() {
      return this.selectedRow?.ordinateur
    },
  },
  async created() {
    await this.fetchAffectations()
  },

  methods: {
    fetchAffectations() {
      store.dispatch('affectationsPcStore/fetchAffectations')
    },
    OpenAffectationModal(affectation) {
      this.$root.$emit('affectation-modal-trigger', affectation)
    },
    print(ordinateurs) {
      const resolvedRoute = this.$router.resolve({
        name: 'print-page',
        params: { id: '1' },
        query: { data: JSON.stringify(ordinateurs) },
      })
      window.open(resolvedRoute.href, '_blank')
    },
    generateSubMenu() {
      const menu = []
      if (this.ordins) {
        this.ordins.forEach(item => {
          menu.push({ label: item.sn, icon: 'pi pi-fw pi-circle-off', items: this.generateSubMenuActions(item) })
        })
      }
      return menu
    },
    generateSubMenuActions(item) {
      return [
        { label: 'Rendu', icon: 'pi pi-fw pi-check', command: () => this.ReturnOrdinateur(item) },
        { label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenAffectationModal(item) },
        { label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.DeleteAffectation(item) },
      ]
    },
    DeleteAffectation(data) {
      ConfirmDelete('affectationsPcStore/deleteAffectation', data)
    },
    ReturnOrdinateur(data) {
      console.log(data)
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
<!--<template>
  <b-card
    no-body
    class="p-1"
  >
    <DataTable
      :value="affectations"
      :loading="loading"
      :expanded-rows.sync="expandedRows"
      data-key="sn"
      responsive-layout="scroll"
      @row-expand="onRowExpand"
      @row-collapse="onRowCollapse"
    >
      <Column
        :expander="true"
        :header-style="{'width': '3rem'}"
      />
      <Column
        v-for="col in columns"
        :key="col.field"
        v-bind="col"
      >
        <template
          #body="{data}"
        >
          {{ data[col.field] }}
        </template>
      </Column>
      <template #expansion="{data}">
        <ListOrdinateurAffecter :ordinateurs="data.ordinateur" />
      </template>
    </DataTable>

  </b-card>
</template>

<script>
import { BCard, BButton } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import 'primevue/resources/themes/fluent-light/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import ListOrdinateurAffecter from './components/ListOrdinateurAffecter'

export default {
  name: 'Utilisateurs',
  components: {
    BCard,
    BButton,
    DataTable,
    Column,
    ListOrdinateurAffecter,
  },
  data() {
    return {
      tableName: 'userTable',
      columns: [
        { field: 'full_name', header: 'Nom Complete', sortable: true },
        { field: 'sn', header: 'Numéro Serie', sortable: true },
        { field: 'projets', header: 'Projets', sortable: true },
        { field: 'ordinateurs_count', header: 'Nombre du PC Affecter', sortable: true },
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
      fakeData: [
        {
          full_name: 'Jamal said',
          ordinateurs_count: 1,
          sn: 'DlDH35372',
          ordinateur: [
            {
              id: 1,
              marque: 'Fujitsu',
              reference: 'X240',
              sn: 'PC0214XT',
              processor: 'Processeur i5',
              ram: '8 Go',
              disk: 'HDD 300 Go',
              state: 'Fonctinnel',
              affecter: 'Oui',
              remarque: 'ddddd',
              created_by: '1',
              updated_by: 'Jamal Said',
              deleted_by: 'Jamal Said',
              deleted_at: null,
              created_at: '08/27/2021',
              updated_at: '2022-04-04T11:21:33.000000Z',
              pivot: {
                salarie_id: 14, ordinateur_id: 1, created_at: '04/04/2022', updated_at: '04/04/2022', projet_id: 2, affected_at: '2022/04/04', remarque: null, created_by: 'Jamal Said', updated_by: 'Jamal Said',
              },
            },
          ],
          projets: 'Cleo , BACK OFFICE',
        },
        {
          full_name: 'test User',
          ordinateurs_count: 1,
          sn: 'PC0214XT',
          ordinateur: [
            {
              id: 6,
              marque: 'Dell',
              reference: 'X240',
              sn: 'DlDH35372',
              processor: 'Processeur i5',
              ram: '8 Go',
              disk: 'HDD 300 Go',
              state: 'Fonctinnel',
              affecter: 'Oui',
              remarque: null,
              created_by: 'Jamal Said',
              updated_by: 'Jamal Said',
              deleted_by: null,
              deleted_at: null,
              created_at: '09/07/2021',
              updated_at: '2022-04-13T14:58:50.000000Z',
              pivot: {
                salarie_id: 14, ordinateur_id: 6, created_at: '04/13/2022', updated_at: '04/13/2022', projet_id: 1, affected_at: '2022/03/29', remarque: null, created_by: 'Jamal Said', updated_by: 'Jamal Said',
              },
            }],
          projets: 'Cleo , BACK OFFICE',
        },
      ],
      expandedRows: [],
    }
  },
  computed: {
    ...mapGetters({
      affectations: 'affectationsPcStore/getAffectations',
      loading: 'affectationsPcStore/getLoading',
    }),
  },
  async created() {
    await this.fetchAffectations()
  },
  methods: {
    fetchAffectations() {
      store.dispatch('affectationsPcStore/fetchAffectations')
    },
    onRowExpand(event) {
      console.log(event)
    },
    onRowCollapse(event) {
      console.log(event)
    },
  },
}
</script>

<style scoped>

</style>-->
