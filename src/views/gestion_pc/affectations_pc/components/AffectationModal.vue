<template>
  <div>
    <b-modal
      ref="AffectationModal"
      v-model="ModalSync"
      :title="title"
      centered
      :ok-title="editMode ? 'Modifier' : 'Ajouter'"
      cancel-title="Férmer"
      button-size="sm"
      no-close-on-backdrop
      @ok="submit"
    >
      <b-alert
        variant="primary"
        :show="dataAffected.hasPc"
      >
        <div class="alert-body text-center">
          <span> Cet utilisateu a déjà : <strong>{{ dataAffected.nmbr }}</strong> PC</span>
        </div>
      </b-alert>
      <b-overlay
        :show="isReady"
        rounded="sm"
      >
        <b-form @submit.prevent>
          <b-row class="mt-1">
            <b-col md="6">
              <b-form-group
                label="Nom Complete"
                label-for="salary_id"
              >
                <v-select
                  v-model="form.salary_id"
                  input-id="salary_id"
                  placeholder="choisir ..."
                  label="full_name"
                  :reduce="item => item.id"
                  :options="Salaries"
                  :selectable="option => option.deleted_by === null && option.deleted_at === null"
                  class="select-size-sm"
                  @input="onUserSelect()"
                />
                <HasError
                  :form="form"
                  field="salary_id"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Numéro de Série d'ordinateur"
                label-for="laptop_id"
              >
                <v-select
                  v-if="!editMode || $can('manage', 'all')"
                  v-model="form.laptop_id"
                  input-id="sn"
                  placeholder="choisir ..."
                  label="sn"
                  :reduce="item => item.id"
                  :selectable="option => option.affecter === 'Non' && option.deleted_at === null"
                  :options="Laptops"
                  class="select-size-sm"
                  @input="form.errors.clear('laptop_id')"
                />
                <b-form-input
                  v-else
                  id="sn"
                  :value="form.sn"
                  size="sm"
                  disabled
                />
                <HasError
                  :form="form"
                  field="laptop_id"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Projet"
                label-for="projet_id"
              >
                <v-select
                  v-model="form.projet_id"
                  input-id="projet_id"
                  placeholder="choisir ..."
                  label="name"
                  :reduce="item => item.id"
                  :options="Projets"
                  class="select-size-sm"
                  @input="form.errors.clear('projet_id')"
                />
                <HasError
                  :form="form"
                  field="projet_id"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Date d'affectation"
                label-for="affected_at"
              >
                <flat-pickr
                  v-model="form.affected_at"
                  class="form-control form-control-sm"
                  placeholder="choisir ..."
                  :config="{dateFormat: 'd/m/Y'}"
                  @input="form.errors.clear('affected_at')"
                />
                <HasError
                  :form="form"
                  field="affected_at"
                />
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Remarque"
                label-for="remarque"
              >
                <b-form-input
                  id="remarque"
                  v-model="form.remarque"
                  size="sm"
                  placeholder="......"
                  @input="form.errors.clear('remarque')"
                />
                <HasError
                  :form="form"
                  field="remarque"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      </b-overlay>
    </b-modal>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import {
  BCol, BForm, BFormGroup, BFormInput, BModal, BRow, BAlert, BOverlay,
} from 'bootstrap-vue'
import { HasError } from 'vform/src/components/bootstrap5'
import Form from 'vform'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'AffectationModal',
  components: {
    BModal,
    BForm,
    BRow,
    BCol,
    BAlert,
    BFormGroup,
    BFormInput,
    BOverlay,
    HasError,
    flatPickr,
  },
  data() {
    return {
      ModalSync: false,
      title: null,
      editMode: false,
      form: new Form({
        salary_id: null,
        laptop_id: null,
        projet_id: null,
        affected_at: null,
        remarque: null,
        sn: null,
      }),
      pcAffected: false,
      dataAffected: {
        hasPc: false,
        nmbr: 0,
      },
      isReady: false,
    }
  },
  computed: {
    filteredSalaries() {
      return [
        {
          data: this.Salaries.data?.filter(option => option.full_name?.toLowerCase()
            .includes(this.form.full_name?.toLowerCase())),
        },
      ]
    },
    ...mapGetters({
      Salaries: 'salariesStore/getSalaries',
      Laptops: 'laptopsStore/getLaptops',
      Projets: 'projetsStore/getProjets',
      affectations: 'affectationsPcStore/getAffectations',
    }),
    NoTrashedSalaries() {
      return this.Salaries.filter(item => item.deleted_at === null)
    },
  },
  async created() {
    this.$root.$on('affectation-modal-trigger', affectation => {
      this.editMode = false
      this.isReady = true
      this.LoadData()
      this.ModalSync = !this.ModalSync
      this.dataAffected = {}
      this.form.clear()
      this.form.reset()
      this.title = 'Ajouter Une Affectation'
      if (affectation) {
        this.editMode = true
        this.title = `☑️ Créer Par : ${affectation.pivot.created_by}`
        for (const [key, value] of Object.entries(affectation.pivot)) {
          this.form[key] = value
        }
        this.form.sn = affectation.sn
        const pr = this.Projets.find(item => item.id === this.form.projet_id)
        if (pr) { this.cp = pr.name }
      }
    })
  },
  methods: {
    async LoadData() {
      if (this.Salaries.length === 0) await store.dispatch('salariesStore/fetchSalaries')
      if (this.Laptops.length === 0) await store.dispatch('laptopsStore/fetchLaptops')
      if (this.Projets.length === 0) await store.dispatch('projetsStore/fetchProjets')
      this.isReady = false
    },
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.editMode ? this.editAffectation() : this.addAffectation()
    },
    addAffectation() {
      store.dispatch('affectationsPcStore/addAffectation', this.form).then(() => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    editAffectation() {
      store.dispatch('affectationsPcStore/editAffectation', this.form).then(() => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.ModalSync = !this.ModalSync
            this.editMode = false
          }
        })
      })
    },
    getSuggestionValue(suggestion) {
      return suggestion.item.full_name
    },
    onUserSelect() {
      this.form.errors.clear('salary_id')
      if (this.form.salary_id) {
        const fullname = this.Salaries.find(item => item.id === this.form.salary_id)
        this.dataAffected.hasPc = !!this.affectations.find(item => item.full_name === fullname.full_name)
        this.dataAffected.nmbr = (this.affectations.find(item => item.full_name === fullname.full_name)?.affected_laptops)?.length ?? 0
      }
    },
    handleState(field) {
      return this.form.errors.has(field) ? false : null
    },
  },
}
</script>
