<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        :table-name="tableName"
        :table-data="affectations"
        :columns="columns"
        :is-loading="loading"
        data-key="sn"
        :has-deleted-filter="false"
        :menu-options="menuOptions"
        :actions-buttons="actionsButtons"
        @selected-row="row => selectedRow = row "
      />
    </b-card>
    <AffectationModal />
    <ListOrdinateurAffecterModal :table-name="tableName" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { BCard } from 'bootstrap-vue'
import { ConfirmDelete } from '@/libs/sweet-alerts'
import Form from '@core/auth/jwt/vformAxios'
import AffectationModal from './components/AffectationModal'
import ListOrdinateurAffecterModal from './components/ListLaptopsAffecterModal'

export default {
  name: 'AffectationsTable',
  components: {
    BCard,
    AffectationModal,
    ListOrdinateurAffecterModal,
  },
  data() {
    return {
      tableName: 'affectations_pc',
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
          field: 'affected_laptops_count',
          header: 'Nombre du PC Affecter',
          sortable: true,
        },
      ],
      actionsButtons: [
        {
          variant: 'gradient-primary', icon: 'PlusIcon', command: () => this.OpenAffectationModal(), permission: 'create',
        },
        {
          variant: 'gradient-secondary', icon: 'RefreshCwIcon', command: () => this.fetchAffectations(), permission: 'read',
        },
      ],
      selectedRow: null,
      form: new Form({}),
      menuOptions: [],
    }
  },
  computed: {
    ...mapGetters({
      affectations: 'affectationsPcStore/getAffectations',
      loading: 'affectationsPcStore/getLoading',
    }),
  },
  watch: {
    selectedRow(row) {
      const menu = [
        {
          label: 'Afficher', icon: 'pi pi-fw pi-eye', command: () => this.showAffectedPcs(row), visible: this.$can('read', this.tableName),
        },
        {
          label: 'Imprimer', icon: 'pi pi-fw pi-print', command: () => this.print(row), visible: this.$can('print', this.tableName),
        },
      ]

      if (row?.affected_laptops_count > 1) {
        menu.push({ label: 'Ordinateurs', icon: 'pi pi-fw pi-desktop', items: this.generateSubMenu(row) })
      } else {
        menu.push(...[
          {
            label: 'Rendu', icon: 'pi pi-fw pi-check', command: () => this.ReturnOrdinateur(row.affected_laptops[0]), visible: this.$can('return_pc', this.tableName),
          },
          {
            label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenAffectationModal(row.affected_laptops[0]), visible: this.$can('update', this.tableName),
          },
          {
            label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.DeleteAffectation(row.affected_laptops[0]), visible: this.$can('delete', this.tableName),
          },
        ])
      }
      this.menuOptions = menu
    },
  },
  async created() {
    await this.fetchAffectations()
  },
  methods: {
    fetchAffectations() {
      if (this.$can('read', this.tableName)) {
        store.dispatch('affectationsPcStore/fetchAffectations')
      }
    },
    OpenAffectationModal(affectation) {
      this.$root.$emit('affectation-modal-trigger', affectation)
    },
    print(laptops) {
      const resolvedRoute = this.$router.resolve({
        name: 'print-affectation',
        params: { id: '1' },
        query: { data: JSON.stringify(laptops) },
      })
      window.open(resolvedRoute.href, '_blank')
    },
    generateSubMenu(row) {
      const menu = []
      if (row) {
        row.affected_laptops.forEach(item => {
          menu.push({ label: item.sn, icon: 'pi pi-fw pi-circle-off', items: this.generateSubMenuActions(item) })
        })
      }
      return menu
    },
    generateSubMenuActions(item) {
      return [
        {
          label: 'Rendu', icon: 'pi pi-fw pi-check', command: () => this.ReturnOrdinateur(item), visible: this.$can('return_pc', this.tableName),
        },
        {
          label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenAffectationModal(item), visible: this.$can('update', this.tableName),
        },
        {
          label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.DeleteAffectation(item), visible: this.$can('delete', this.tableName),
        },
      ]
    },
    DeleteAffectation(data) {
      if (this.$can('read', this.tableName)) {
        ConfirmDelete('affectationsPcStore/deleteAffectation', data)
      }
    },
    showAffectedPcs(data) {
      this.$root.$emit('list-affectation-modal-trigger', data)
    },
    ReturnOrdinateur(data) {
      this.$swal({
        title: 'Saisi la Raison : ',
        input: 'text',
      }).then(res => {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(data.pivot)) {
          this.form[key] = value
        }
        if (res.value) this.form.raison = res.value
        store.dispatch('retoursPcStore/addReturn', this.form).catch(e => {
          const { errors } = e.response.data
          // eslint-disable-next-line no-restricted-syntax
          for (const [value] of Object.entries(errors)) {
            this.$toast(value)
          }
        })
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
<style>
.swal2-input{
  height: 30px
}
.swal2-popup {
  width: 25em;
}
.swal2-styled {
  padding: 0.325em 1em;
}
</style>
