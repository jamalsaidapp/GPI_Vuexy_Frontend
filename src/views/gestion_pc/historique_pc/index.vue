<template>
  <b-card
    no-body
    class="p-1"
  >
    <JDatatable
      :table-name="tableName"
      :table-data="retours"
      :columns="columns"
      :is-loading="loading"
      data-key="sn"
      :has-deleted-filter="false"
      :menu-options="menuOptions"
      :actions-buttons="actionsButtons"
      @selected-row="row => selectedRow = row "
    />
    <ListLaptopsRenduModal />
    <ReturnLaptopModal />
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import JDatatable from '@/myCompenents/JDatatable'
import {
  BCard,
} from 'bootstrap-vue'
import { ConfirmDelete, restoreObjData } from '@/libs/sweet-alerts'
import Form from 'vform'
import ListLaptopsRenduModal from './components/ListLaptopsRenduModal'
import ReturnLaptopModal from './components/ReturnLaptopModal'

export default {
  name: 'UpdateRetoursTable',
  components: {
    JDatatable,
    BCard,
    ListLaptopsRenduModal,
    ReturnLaptopModal,
  },
  data() {
    return {
      tableName: 'returns_pc',
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
          field: 'returned_laptops_count',
          header: 'Nombre du PC rendu',
          sortable: true,
        },
      ],
      selectedRow: null,
      actionsButtons: [
        { variant: 'gradient-secondary', icon: 'RefreshCwIcon', command: () => this.fetchRetours() },
      ],
      form: new Form({}),
      menuOptions: [],
    }
  },
  computed: {
    ...mapGetters({
      retours: 'retoursPcStore/getRetours',
      loading: 'retoursPcStore/getLoading',
    }),
  },
  watch: {
    selectedRow(row) {
      const menu = [
        {
          label: 'Afficher', icon: 'pi pi-fw pi-eye', command: () => this.showReturnedPcs(row), visible: this.$can('read', this.tableName),
        },
        {
          label: 'Imprimer', icon: 'pi pi-fw pi-print', command: () => this.print(row), visible: this.$can('print', this.tableName),
        },
      ]

      if (row?.returned_laptops_count > 1) {
        menu.push({ label: 'Ordinateurs', icon: 'pi pi-fw pi-desktop', items: this.generateSubMenu(row) })
      } else {
        menu.push(...[
          {
            label: 'Restaurer', icon: 'pi pi-fw pi-reply', command: () => this.RestoreAffectation(row.affected_laptops[0]), visible: this.$can('restore_pc', this.tableName),
          },
          {
            label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenReturnModalUpdate(row.affected_laptops[0]), visible: this.$can('update', this.tableName),
          },
          {
            label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.DeleteReturn(row.affected_laptops[0]), visible: this.$can('delete', this.tableName),
          },
        ])
      }
      this.menuOptions = menu
    },
  },
  async created() {
    await this.fetchRetours()
  },

  methods: {
    fetchRetours() {
      store.dispatch('retoursPcStore/fetchRetours')
    },
    print(laptops) {
      const resolvedRoute = this.$router.resolve({
        name: 'print-retour',
        params: { id: '1' },
        query: { data: JSON.stringify(laptops) },
      })
      window.open(resolvedRoute.href, '_blank')
    },
    generateSubMenu(row) {
      const menu = []
      if (row) {
        row.returned_laptops.forEach(item => {
          menu.push({ label: item.sn, icon: 'pi pi-fw pi-circle-off', items: this.generateSubMenuActions(item) })
        })
      }
      return menu
    },
    generateSubMenuActions(item) {
      return [
        {
          label: 'Restaurer', icon: 'pi pi-fw pi-reply', command: () => this.RestoreAffectation(item), visible: this.$can('restore_pc', this.tableName),
        },
        {
          label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenReturnModalUpdate(item), visible: this.$can('update', this.tableName),
        },
        {
          label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.DeleteReturn(item), visible: this.$can('delete', this.tableName),
        },
      ]
    },
    showReturnedPcs(data) {
      this.$root.$emit('list-retours-modal-trigger', data)
    },
    OpenReturnModalUpdate(data) {
      this.$root.$emit('return-modal-trigger', data)
    },
    RestoreAffectation(data) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(data.pivot)) {
        this.form[key] = value
      }
      this.$swal.fire(restoreObjData).then(result => {
        if (result.value) {
          store.dispatch('affectationsPcStore/restoreAffectation', this.form).catch(e => {
            const { errors } = e.response.data
            // eslint-disable-next-line no-restricted-syntax
            for (const [key, value] of Object.entries(errors)) {
              this.$bvToast.toast(value, { title: key, variant: 'danger', solid: true })
            }
          })
        }
      })
    },
    DeleteReturn(data) {
      ConfirmDelete('retoursPcStore/deleteReturn', data)
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
