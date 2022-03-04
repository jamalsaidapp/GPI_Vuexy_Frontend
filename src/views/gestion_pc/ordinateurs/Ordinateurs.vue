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
          has-deleted-filter
      >
        <template #action_table>
          <b-button
              variant="gradient-secondary"
              class="btn-icon rounded-circle mr-1"
              size="sm"
              @click="fetchOrdinateurs"
          >
            <feather-icon icon="RefreshCwIcon"/>
          </b-button>
          <b-button
              variant="gradient-primary"
              class="btn-icon rounded-circle"
              size="sm"
              @click="OpenOrdinateurModal(null)"
          >
            <feather-icon icon="PlusIcon"/>
          </b-button>
        </template>

        <template v-slot:actions_button="props">
          <b-button
              variant="gradient-warning"
              class="btn-icon rounded-circle mr-1"
              size="sm"
              @click="DuplicateRow(props.props)"
          >
            <feather-icon icon="CopyIcon"/>
          </b-button>
          <b-button
              variant="gradient-success"
              class="btn-icon rounded-circle mr-1"
              size="sm"
              @click="OpenOrdinateurModal(props.props)"
          >
            <feather-icon icon="EditIcon"/>
          </b-button>
          <b-button v-if="!props.props.deleted_at"
              variant="gradient-danger"
              class="btn-icon rounded-circle"
              size="sm"
              @click="deleteOrdinateur(props.props.id)"
          >
            <feather-icon icon="Trash2Icon"/>
          </b-button>
          <b-button v-else
              variant="gradient-primary"
              class="btn-icon rounded-circle"
              size="sm"
              @click="restoreOrdinateur(props.props.id)"
          >
            <feather-icon icon="CornerRightUpIcon"/>
          </b-button>
        </template>
      </JDatatable>
    </b-card>
    <OrdinateurModal />
  </div>
</template>

<script>

import JDatatable from "@/myCompenents/JDatatable";
import {BButton, BCard, BListGroup, BListGroupItem} from "bootstrap-vue";
import {mapGetters} from "vuex";
import store from "@/store";
import OrdinateurModal from "@/views/gestion_pc/ordinateurs/OrdinateurModal";
import ToastificationContent from "@core/components/toastification/ToastificationContent";

export default {
  name: 'Ordinateurs_Table',
  components: {
    JDatatable,
    BButton,
    BCard,
    BListGroup,
    BListGroupItem,
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
        {
          field: 'id',
          header: '#',
          sortable: true,
        },
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
    }
  },
  async created() {
    await this.fetchOrdinateurs()
  },

  methods: {
    fetchOrdinateurs() {
      store.dispatch('ordinateursStore/fetchOrdinateurs')
    },
    deleteOrdinateur(id){
      store.dispatch('ordinateursStore/deleteOrdinateur',id).then(res => {
        this.$nextTick(() => {
          if (res.data.msg) {
            this.toastNotification(res.data.msg, 'Trash2', 'success')
          }
        })
      })
    },
    restoreOrdinateur(id){
      store.dispatch('ordinateursStore/restoreOrdinateur',id).then(res => {
        this.$nextTick(() => {
          if (res.data.msg) {
            this.toastNotification(res.data.msg, 'CornerRightUp', 'success')
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
