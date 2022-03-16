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
          v-slot:expand="props"
          class="ml-auto"
        >
          <ListOrdinateurAffecter :ordinateurs="props.props.ordinateur" />
        </template>

        <template v-slot:actions_button="props">
          <b-button
              variant="gradient-primary"
              class="btn-icon rounded-circle mr-1"
              size="sm"
              @click="print(props.props)"
          >
            <feather-icon icon="PrinterIcon"/>
          </b-button>
        </template>
      </JDatatable>
    </b-card>
    <AffectationModal />
    <UpdateListOrdinateurAffecter />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import JDatatable from '@/myCompenents/JDatatable'
import {
  BButton, BCard,
} from 'bootstrap-vue'
import AffectationModal from './components/AffectationModal'
import ListOrdinateurAffecter from './components/ListOrdinateurAffecter'
import UpdateListOrdinateurAffecter from './components/UpdateListOrdinateurAffecter'
import router from "@/router";

export default {
  name: 'UpdateAffectationsTable',
  components: {
    JDatatable,
    BButton,
    BCard,
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
      transProps: {
        name: 'flip-list'
      },
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
      this.$root.$emit('affectation-modal-trigger', affectation)
    },
    print(data){
      // let routeData = router.resolve({path: 'print-page'});
      // console.log(routeData)
      window.open('/print-page', '_blank');
      console.log(data);
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
<style>


