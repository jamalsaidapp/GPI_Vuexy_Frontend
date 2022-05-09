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
              label="Nom Complete"
              label-for="full_name"
            >
              <b-form-input
                id="full_name"
                v-model="form.full_name"
                size="sm"
                placeholder="Tapper Prénom"
                :state="handleState('full_name')"
                @input="form.errors.clear('full_name')"
              />
              <HasError
                :form="form"
                field="full_name"
              />
            </b-form-group>
            <b-form-group
              label="Affecter un compte"
              label-for="full_name"
            >
              <b-form-input
                id="cin"
                v-model="form.cin"
                size="sm"
                placeholder="Tapper CIN"
                :state="handleState('cin')"
                @input="form.errors.clear('cin')"
              />
              <HasError
                :form="form"
                field="cin"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Affecter un compte"
              label-for="full_name"
            >
              <v-select
                v-model="form.user_id"
                placeholder="choisir ..."
                label="name"
                :reduce="item => item.id"
                :options="options"
                class="select-size-sm"
                @input="form.is_user = form.user_id !== null"
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
import Form from 'vform'
import store from '@/store'
import { toastNotification } from '@/libs/toastification'
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
  data() {
    return {
      ModalSync: false,
      title: '',
      form: new Form({
        id: '',
        full_name: '',
        cin: '',
        is_user: false,
        user_id: null,
      }),
    }
  },
  computed: {
    ...mapGetters({
      users: 'usersStore/getUsers',
      loading: 'usersStore/getLoading',
    }),
    options() {
      return this.users.map(user => ({ name: `${user.first_name} ${user.last_name}`, id: user.id }))
    },
  },
  created() {
    this.$root.$on('salarie-modal-sync', salarie => {
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      this.title = 'Ajouter Un Salarie'
      if (salarie) {
        this.form.fill(salarie)
        this.form.is_user = Boolean(this.form.is_user)
        this.title = `Modification Salarie : ${this.form.full_name}`
      }
    })
    store.dispatch('usersStore/fetchUsers')
  },
  methods: {
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.form.id ? this.editOrdinateur() : this.addOrdinateur()
    },
    addOrdinateur() {
      store.dispatch('salariesStore/addSalarie', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            toastNotification(res.data.msg, 'Salarie', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    editOrdinateur() {
      store.dispatch('salariesStore/editSalarie', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            toastNotification(res.data.msg, 'Salarie', 'success')
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
