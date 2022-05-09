<template>
  <div>
    <b-modal
      ref="OrdinateurModal"
      v-model="ModalSync"
      :title="title"
      centered
      :ok-title="form.id ? 'Modifier' : 'Ajouter'"
      cancel-title="Férmer"
      button-size="sm"
      no-close-on-backdrop
      @ok="submit"
    >
      <b-form @submit.prevent>
        <b-row class="mt-1">
          <b-col md="6">
            <b-form-group
              label="Marque Du Pc"
              label-for="marque"
            >
              <v-select
                v-model="form.marque"
                input-id="marque"
                placeholder="choisir La marque"
                :options="Marques"
                :state="handleState('marque')"
                class="select-size-sm"
                @input="form.errors.clear('marque')"
              />
              <HasError
                :form="form"
                field="marque"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Réference"
              label-for="Réference"
            >
              <b-form-input
                id="reference"
                v-model="form.reference"
                size="sm"
                placeholder="Tapper Réference"
                :state="handleState('reference')"
                @input="form.errors.clear('reference')"
              />
              <HasError
                :form="form"
                field="reference"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Numéro De Série"
              label-for="sn"
            >
              <b-form-input
                id="sn"
                v-model="form.sn"
                v-uppercase
                size="sm"
                placeholder="Tapper Numéro De Série"
                :state="handleState('sn')"
                @input="form.errors.clear('sn')"
              />
              <HasError
                :form="form"
                field="sn"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Mémoire RAM"
              label-for="Mémoire RAM"
            >
              <v-select
                v-model="form.ram"
                input-id="ram"
                placeholder="choisir La Mémoire RAM"
                :options="Ram"
                :state="handleState('ram')"
                class="select-size-sm"
                @input="form.errors.clear('ram')"
              />
              <HasError
                :form="form"
                field="ram"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Micro Processeur"
              label-for="processor"
            >
              <v-select
                v-model="form.processor"
                input-id="processor"
                placeholder="choisir Le Processeur"
                :options="Processors"
                :state="handleState('processor')"
                class="select-size-sm"
                @input="form.errors.clear('processor')"
              />
              <HasError
                :form="form"
                field="processor"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Disque Dur"
              label-for="disk"
            >
              <v-select
                v-model="form.disk"
                input-id="disk"
                placeholder="choisir Type Dique Dur"
                :options="Disk"
                :state="handleState('disk')"
                class="select-size-sm"
                @input="form.errors.clear('disk')"
              />
              <HasError
                :form="form"
                field="disk"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Etat Du PC"
              label-for="state"
            >
              <v-select
                v-model="form.state"
                input-id="state"
                placeholder="choisir l'etat du PC"
                :options="States"
                :state="handleState('state')"
                class="select-size-sm"
                @input="form.errors.clear('state')"
              />
              <HasError
                :form="form"
                field="state"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Affecter ?"
              label-for="affecter"
            >
              <v-select
                v-model="form.affecter"
                input-id="affecter"
                placeholder="choisir ..."
                :options="['Oui','Non']"
                :state="handleState('affecter')"
                class="select-size-sm"
                @input="form.errors.clear('affecter')"
              />
              <HasError
                :form="form"
                field="affecter"
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
                placeholder="Tapper une Remarque"
                :state="handleState('remarque')"
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
import {
  BCol, BForm, BFormGroup, BFormInput, BModal, BRow,
} from 'bootstrap-vue'
import { HasError } from 'vform/src/components/bootstrap5'
import store from '@/store'
import Form from 'vform'
import { toastNotification } from '@/libs/toastification'
import {
  $Marques, $Processors, $Ram, $Disk, $States,
} from './OrdinateurConfig'

export default {
  name: 'OrdinateurModal',
  components: {
    BModal,
    BForm,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    HasError,
  },
  data() {
    return {
      ModalSync: false,
      title: '',
      form: new Form({
        id: '',
        marque: '',
        reference: '',
        sn: '',
        ram: '',
        disk: '',
        processor: '',
        affecter: '',
        state: '',
        remarque: '',
      }),
      Marques: $Marques,
      Processors: $Processors,
      States: $States,
      Ram: $Ram,
      Disk: $Disk,
    }
  },
  created() {
    this.$root.$on('ordinateur-modal-sync', ordinateur => {
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      this.title = 'Ajouter Un Ordinateur'
      if (ordinateur) {
        this.form.fill(ordinateur)
        this.title = `Modification : ${this.form.marque} ${this.form.reference}`
      }
    })
    this.$root.$on('duplicate-row', ordinateur => {
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      this.title = 'Ajouter Un Ordinateur'
      if (ordinateur) {
        delete ordinateur.id
        delete ordinateur.sn
        delete ordinateur.remarque
        this.form.fill(ordinateur)
      }
    })
  },
  methods: {
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.form.id ? this.editOrdinateur() : this.addOrdinateur()
    },
    addOrdinateur() {
      store.dispatch('ordinateursStore/addOrdinateur', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            toastNotification(res.data.msg, 'Ordinateur', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    editOrdinateur() {
      store.dispatch('ordinateursStore  /editOrdinateur', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            toastNotification(res.data.msg, 'Ordinateur', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    handleState(field) {
      return this.form.errors.has(field) ? false : null
    },

  },
}
</script>

<style scoped>

</style>
