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
          <b-col md="12">
            <b-form-group
              label="Nom Projet"
              label-for="name"
            >
              <b-form-input
                id="name"
                v-model="form.name"
                size="sm"
                placeholder="Tapper Nom Projet"
                :state="handleState('name')"
                @input="form.errors.clear('name')"
              />
              <HasError
                :form="form"
                field="name"
              />
            </b-form-group>
            <b-form-group
              label="Code Projet"
              label-for="code"
            >
              <b-form-input
                id="code"
                v-model="form.code"
                size="sm"
                placeholder="Tapper Code Projet"
                :state="handleState('code')"
                @input="form.errors.clear('code')"
              />
              <HasError
                :form="form"
                field="code"
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
import Form from '@core/auth/jwt/vformAxios'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'SalarieModal',
  components: {
    BModal,
    BForm,
    BRow,
    BCol,
    BFormInput,
    BFormGroup,
    HasError,
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    tableName: String,
  },
  data() {
    return {
      ModalSync: false,
      title: '',
      form: new Form({
        id: '',
        name: '',
        code: '',
      }),
    }
  },
  computed: {
    ...mapGetters({
      users: 'projetsStore/getUsers',
      loading: 'projetsStore/getLoading',
    }),
  },
  created() {
    this.$root.$on('projet-modal-sync', salary => {
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      this.title = 'Ajouter Un Projet'
      if (salary) {
        this.form.fill(salary)
        this.title = `Modification Projet : ${this.form.name}`
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
      if (this.$can('create', this.tableName)) {
        store.dispatch('projetsStore/addProjet', this.form).then(() => {
          this.$nextTick(() => {
            if (this.form.successful) {
              this.ModalSync = !this.ModalSync
            }
          })
        })
      }
    },
    editOrdinateur() {
      if (this.$can('update', this.tableName)) {
        store.dispatch('projetsStore/editProjet', this.form).then(() => {
          this.$nextTick(() => {
            if (this.form.successful) {
              this.ModalSync = !this.ModalSync
            }
          })
        })
      }
    },
    handleState(field) {
      return this.form.errors.has(field) ? false : null
    },
  },
}
</script>
