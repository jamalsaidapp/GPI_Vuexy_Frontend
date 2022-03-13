<template>
  <div>
    <b-card
      no-body
      class="p-1"
    >
      <JDatatable
        table-name="Historique_Pc"
        :table-data="retours"
        :selected-rows="selectedRows"
        :columns="columns"
        :isloading="loading"
        has-expansion
        data-key="sn"
        :has-actions="false"
      >
        <template #action_table>
          <b-button
            variant="gradient-secondary"
            class="btn-icon rounded-circle mr-1"
            size="sm"
            @click="fetchRetours"
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
          v-slot:expand="props"
          class="ml-auto"
        >
          <ListOrdinateurAffecter :ordinateurs="props.props.ordinateur" />
        </template>
      </JDatatable>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import JDatatable from '@/myCompenents/JDatatable'
import {
  BButton, BCard,
} from 'bootstrap-vue'
import ListOrdinateurAffecter from './components/ListOrdinateursRendu'

export default {
  name: 'UpdateRetoursTable',
  components: {
    JDatatable,
    BButton,
    BCard,
    ListOrdinateurAffecter,
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
          field: 'ordinateurs_count',
          header: 'Nombre du PC rendu',
          sortable: true,
        },
      ],
      selectedRows: [],
    }
  },
  computed: {
    ...mapGetters({
      retours: 'historiquePcStore/getRetours',
      loading: 'historiquePcStore/getLoading',
    }),
  },
  async created() {
    await this.fetchRetours()
  },

  methods: {
    fetchRetours() {
      store.dispatch('historiquePcStore/fetchRetours')
    },

    OpenAffectationModal(affectation) {
      this.$root.$emit('affectation-modal-trigger', affectation)
    },

  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
