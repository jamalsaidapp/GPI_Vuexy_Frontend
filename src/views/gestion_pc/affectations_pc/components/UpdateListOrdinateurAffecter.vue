<template>
  <div>
    <b-modal
      ref="AffectationModal"
      v-model="ModalSync"
      :title="title"
      centered
      ok-title=" Modifier "
      cancel-title="Férmer"
      button-size="sm"
      no-close-on-backdrop
      @ok="submit"
    >
      <b-form @submit.prevent>
        <b-row class="mt-1">
          <b-col md="6">
            <b-form-group
              label="Nom Complete"
              label-for="salarie_id"
            >
              <v-select
                v-model="form.salarie_id"
                input-id="salarie_id"
                placeholder="choisir ..."
                label="full_name"
                :reduce="item => item.id"
                :options="salaries"
                class="select-size-sm"
                @input="clearFormError('salarie_id')"
              />
              <HasError
                :form="form"
                field="salarie_id"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Numéro de Série d'ordinateur"
              label-for="ordinateur_id"
            >
              <b-form-input
                id="sn"
                :value="form.sn"
                size="sm"
                disabled
                @input="clearFormError('ordinateur_id')"
              />
              <HasError
                :form="form"
                field="ordinateur_id"
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
                  @input="clearFormError('projet_id')"
                  @option:selected="detect_CP"
              />
              <HasError
                  :form="form"
                  field="projet_id"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
                label="Chef Projet"
                label-for="cp"
            >
              <b-form-input
                  id="cp"
                  v-model="cp"
                  size="sm"
                  disabled
                  placeholder="......"
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
                :config="{dateFormat: 'Y/m/d'}"
                @input="clearFormError('affected_at')"
              />
              <HasError
                :form="form"
                field="affected_at"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Remarque"
              label-for="remarque"
            >
              <b-form-input
                id="remarque"
                v-model="form.remarque"
                size="sm"
                placeholder="......"
                @input="clearFormError('remarque')"
              />
              <HasError
                :form="form"
                field="remarque"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import {
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BModal,
  BRow,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { HasError } from 'vform/src/components/bootstrap5'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import Form from 'vform'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'UpdateAffectationModal',
  components: {
    BModal,
    BForm,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    vSelect,
    HasError,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    flatPickr,
  },
  data() {
    return {
      ModalSync: false,
      title: '',
      form: new Form({
        salarie_id: null,
        ordinateur_id: null,
        projet_id: null,
        affected_at: null,
        remarque: null,
        sn: null,
      }),
      cp: null
    }
  },
  computed: {
    filteredSalaries() {
      return [
        {
          data: this.salaries.data?.filter(option => option.full_name?.toLowerCase()
            .includes(this.form.full_name?.toLowerCase())),
        },
      ]
    },
    ...mapGetters({
      salaries: 'salariesStore/getSalaries',
      ordinateurs: 'ordinateursStore/getOrdinateurs',
      Projets: 'projetsStore/getProjets',
    }),
  },
  created() {
    this.$root.$on('update-affectation-modal-sync', affectation => {
      this.LoadData()
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      this.title = `☑️ Créer Par : ${affectation.pivot.created_by}`
      if (affectation) {
        this.form.fill({
          salarie_id: affectation.pivot.salarie_id,
          ordinateur_id: affectation.pivot.ordinateur_id,
          projet_id: affectation.pivot.projet_id,
          affected_at: affectation.pivot.affected_at,
          remarque: affectation.pivot.remarque,
          sn: affectation.sn,
        })
        const pr = this.Projets.find(item => item.id === this.form.projet_id)
        if (pr){
          this.cp = pr.name
        }
      }
    })
  },
  methods: {
    LoadData() {
      if (this.salaries.length === 0) store.dispatch('salariesStore/fetchSalaries')
      if (this.ordinateurs.length === 0) store.dispatch('ordinateursStore/fetchOrdinateurs')
      if (this.Projets.length === 0) store.dispatch('projetsStore/fetchProjets')
    },
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.editAffectation()
    },
    editAffectation() {
      store.dispatch('affectationsPcStore/editAffectation', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.toastNotification(res.data.msg, 'Affectation', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    getSuggestionValue(suggestion) {
      return suggestion.item.full_name
    },
    onSelected(option) {
      if (this.form.salarie_id) this.form.salarie_id = option.id
    },
    detect_CP(option){
      this.cp = option.cp
    },
    clearFormError(field) {
      this.form.errors.clear(field)
    },
    handleState(field) {
      return this.form.errors.has(field) ? false : null
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

    NextTab(props) {
      props.nextTab()
      this.form.fill()
    }
    ,
  },
}
</script>
