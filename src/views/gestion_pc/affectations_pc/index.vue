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
              @click="fetchAffectations"
          >
            <feather-icon icon="RefreshCwIcon"/>
          </b-button>
          <b-button
              variant="gradient-primary"
              class="btn-icon rounded-circle"
              size="sm"
              @click="OpenAffectationModal(null)"
          >
            <feather-icon icon="PlusIcon"/>
          </b-button>
        </template>

        <template class="ml-auto" v-slot:expand="props">
          <ListOrdinateurAffecter :ordinateurs="props.props.ordinateur"/>
        </template>
      </JDatatable>
    </b-card>
    <AffectationModal/>
    <UpdateListOrdinateurAffecter/>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import store from "@/store"
import JDatatable from "@/myCompenents/JDatatable"
import {BButton, BCard, BListGroup, BListGroupItem, BTooltip} from "bootstrap-vue"
import AffectationModal from "./components/AffectationModal"
import ListOrdinateurAffecter from "./components/ListOrdinateurAffecter"
import UpdateListOrdinateurAffecter from "./components/UpdateListOrdinateurAffecter"

export default {
  name: 'Update_Affectations_table',
  components: {
    JDatatable,
    BButton,
    BCard,
    BListGroup,
    BListGroupItem,
    BTooltip,
    ListOrdinateurAffecter,
    AffectationModal,
    UpdateListOrdinateurAffecter,

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
          header: 'Nombre du PC Affecter',
          sortable: true,
        },
      ],
      selectedRows: [],
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

    OpenAffectationModal(affectation) {
      this.$root.$emit('affectation-modal-sync', affectation)
    },
    OpenUpdateAffectationModal(affectation) {
      this.$root.$emit('update-affectation-modal-sync', affectation)
    },

  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
