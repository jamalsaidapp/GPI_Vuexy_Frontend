<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        table-name="Ordinateur"
        :table-data="ordinateurs"
        :selected-rows="selectedRows"
        :columns="columns"
        :isloading="loading"
        :has-actions="false"
        has-deleted-filter
        :menu-options="menuOptions"
        @selected-row=" row => selectedRow = row "
      >
        <template #action_table>
          <b-button
            variant="gradient-secondary"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="fetchOrdinateurs"
          >
            <feather-icon icon="RefreshCwIcon" />
          </b-button>
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            size="sm"
            @click="OpenOrdinateurModal(null)"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </template>
      </JDatatable>
    </b-card>
    <OrdinateurModal />
  </div>
</template>

<script>

import { BButton, BCard } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import OrdinateurModal from '@/views/gestion_pc/ordinateurs/OrdinateurModal'
import { toastNotification } from '@/libs/toastification'
import { ConfirmDelete } from '@/libs/sweet-alerts'

export default {
  name: 'OrdinateursTable',
  components: {
    BButton,
    BCard,
    OrdinateurModal,
  },
  computed: {
    ...mapGetters({
      ordinateurs: 'ordinateursStore/getOrdinateurs',
      loading: 'ordinateursStore/getLoading',
    }),
  },
  data() {
    return {
      columns: [
        // {
        //   field: 'id',
        //   header: '#',
        //   sortable: true,
        // },
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
        {
          field: 'created_by',
          header: 'Créer par',
          sortable: true,
        },
        {
          field: 'updated_by',
          header: 'Modifier par',
          sortable: true,
        },

      ],
      selectedRows: [],
      selectedRow: null,
      menuOptions: [
        { label: 'Modifier', icon: 'pi pi-fw pi-pencil', command: () => this.OpenOrdinateurModal(this.selectedRow) },
        { label: 'Dupliquer', icon: 'pi pi-fw pi-copy', command: () => this.DuplicateRow(this.selectedRow) },
        {
          label: 'Restaurer', icon: 'pi pi-fw pi-refresh', command: () => this.restoreOrdinateur(this.selectedRow.id), visible: false,
        },
        { label: 'Supprimer', icon: 'pi pi-fw pi-trash', command: () => this.deleteOrdinateur(this.selectedRow.id) },
      ],
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    selectedRow(newValue, oldValue) {
      const menu = this.$children[0].$refs.cm
      if (menu) menu.model[2].visible = !(newValue?.deleted_at === null)
    },
  },
  async created() {
    await this.fetchOrdinateurs()
  },

  methods: {
    fetchOrdinateurs() {
      store.dispatch('ordinateursStore/fetchOrdinateurs')
    },
    deleteOrdinateur(id) {
      ConfirmDelete('ordinateursStore/deleteOrdinateur', id)
    },
    restoreOrdinateur(id) {
      store.dispatch('ordinateursStore/restoreOrdinateur', id).then(res => {
        this.$nextTick(() => {
          if (res.data.msg) {
            toastNotification(res.data.msg, 'CornerRightUp', 'success')
          }
        })
      })
    },
    OpenOrdinateurModal(ordinateur) {
      this.$root.$emit('ordinateur-modal-sync', ordinateur)
    },
    DuplicateRow(ordinateur) {
      this.$root.$emit('duplicate-row', ordinateur)
    },
  },
}
</script>

<style scoped>

</style>
