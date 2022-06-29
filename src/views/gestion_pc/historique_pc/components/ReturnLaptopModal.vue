<template>
  <div>
    <b-modal
      ref="AffectationModal"
      v-model="ModalSync"
      :title="title"
      centered
      ok-title="Modifier"
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
              label-for="salary_id"
            >
              <v-select
                v-model="form.salary_id"
                input-id="salary_id"
                placeholder="choisir ..."
                label="full_name"
                :reduce="item => item.id"
                :options="Salaries"
                class="select-size-sm"
                disabled
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
              <b-form-input
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
                label="name"
                :reduce="item => item.id"
                :options="Projets"
                class="select-size-sm"
                disabled
                @input="form.errors.clear('projet_id')"
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
              label="Date d'affectation"
              label-for="affected_at"
            >
              <flat-pickr
                v-model="form.affected_at"
                class="form-control form-control-sm"
                placeholder="choisir ..."
                :config="{dateFormat: 'Y/m/d'}"
                @input="form.errors.clear('affected_at')"
              />
              <HasError
                :form="form"
                field="affected_at"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Raison"
              label-for="raison"
            >
              <b-form-input
                id="cp"
                v-model="form.raison"
                size="sm"
                placeholder="......"
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
    </b-modal>
  </div>
</template>

<script>

import flatPickr from 'vue-flatpickr-component'
import {
  BCol, BForm, BFormGroup, BFormInput, BModal, BRow,
} from 'bootstrap-vue'
import { HasError } from 'vform/src/components/bootstrap5'
import Form from 'vform'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'ReturnLaptopModal',
  components: {
    BModal,
    BForm,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    HasError,
    flatPickr,
  },
  data() {
    return {
      ModalSync: false,
      title: null,
      form: new Form({
        salary_id: null,
        laptop_id: null,
        projet_id: null,
        affected_at: null,
        rendu_at: null,
        remarque: null,
        raison: null,
        sn: null,
      }),
    }
  },
  computed: {
    ...mapGetters({
      Salaries: 'salariesStore/getSalaries',
      Laptops: 'laptopsStore/getLaptops',
      Projets: 'projetsStore/getProjets',
      affectations: 'affectationsPcStore/getAffectations',
    }),
  },
  created() {
    this.$root.$on('return-modal-trigger', retour => {
      this.LoadData()
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      if (retour) {
        this.title = `☑️ Créer Par : ${retour.created_by}`
        this.form.fill({
          salary_id: retour.pivot.salary_id,
          laptop_id: retour.pivot.laptop_id,
          projet_id: retour.pivot.projet_id,
          affected_at: retour.pivot.affected_at,
          rendu_at: retour.pivot.rendu_at,
          remarque: retour.pivot.remarque,
          raison: retour.pivot.raison,
          sn: retour.sn,
        })
      }
    })
  },
  methods: {
    LoadData() {
      if (this.Salaries.length === 0) store.dispatch('salariesStore/fetchSalaries')
      if (this.Laptops.length === 0) store.dispatch('laptopsStore/fetchLaptops')
      if (this.Projets.length === 0) store.dispatch('projetsStore/fetchProjets')
    },
    submit() {

    },
    detect_CP(option) {
      this.cp = option.cp
    },
  },
}
</script>

<style scoped>

</style>
