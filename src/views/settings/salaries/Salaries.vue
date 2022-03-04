<template>
  <div>
    <b-card
        no-body
        class="p-1"
    >
      <JDatatable
          table-name="Salarie"
          :table-data="salaries"
          :selected-rows="selectedRows"
          :columns="columns"
          :isloading="loading"
          has-deleted-filter
      >
        <template #action_table>
          <b-button
              variant="gradient-secondary"
              class="btn-icon rounded-circle mr-1"
              size="sm"
              @click="fetchSalaries"
          >
            <feather-icon icon="RefreshCwIcon" />
          </b-button>
          <b-button
              variant="gradient-primary"
              class="btn-icon rounded-circle"
              size="sm"
              @click="OpenSalarieModal(null)"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </template>

        <template v-slot:actions_button="props">
          <b-button
              variant="gradient-success"
              class="btn-icon rounded-circle mr-1"
              size="sm"
              @click="OpenSalarieModal(props.props)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button
              variant="gradient-danger"
              class="btn-icon rounded-circle"
              size="sm"
              @click="deleteSalarie(props.props.id)"
          >
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </template>
      </JDatatable>
    </b-card>
    <SalarieModal />
  </div>
</template>

<script>
import JDatatable from "@/myCompenents/JDatatable";
import {BButton, BCard} from "bootstrap-vue";
import {mapGetters} from "vuex";
import store from "@/store";
import SalarieModal from "@/views/settings/salaries/SalarieModal";
import ToastificationContent from "@core/components/toastification/ToastificationContent";

export default {
  name: 'Salaries',
  components: {
    JDatatable,
    BButton,
    BCard,
    SalarieModal,
  },
  data() {
    return {
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
          field: 'ordinateurs_count',
          header: 'Nombre du PC Affecter',
          sortable: true,
        },
        {
          field: 'created_by',
          header: 'Créer Par',
          sortable: true,
        },
        {
          field: 'updated_by',
          header: 'Modifier Par',
          sortable: true,
        },
      ],
      selectedRows: [],
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
      store.dispatch('salariesStore/fetchSalaries')
    },
    deleteSalarie(id){
      store.dispatch('salariesStore/deleteSalarie',id).then(res => {
        this.$nextTick(() => {
          if (res.data.msg) {
            this.toastNotification(res.data.msg, 'Trash2', 'success')
          }
        })
      })
    },
    OpenSalarieModal(salarie) {
      this.$root.$emit('salarie-modal-sync', salarie)
    },
    toastNotification(text, icon, variant) {
      this.$toast({
            component: ToastificationContent,
            props: {
              text,
              icon: `${icon}Icon`,
              variant,
            },
          },
          {
            position: 'top-center',
          })
    },
  },
}
</script>

<style scoped>

</style>
