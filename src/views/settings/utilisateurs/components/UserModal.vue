<template>
  <div>
    <b-modal
        ref="UserModal"
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
                label="Nom"
                label-for="first_name"
            >
              <b-form-input
                  ref="first_name"
                  id="first_name"
                  v-model="form.first_name"
                  size="sm"
                  placeholder="Tapper Nom"
                  :state="handleState('first_name')"
                  @input="clearFormError('first_name')"
              />
              <HasError
                  :form="form"
                  field="first_name"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
                label="Prénom"
                label-for="last_name"
            >
              <b-form-input
                  id="last_name"
                  v-model="form.last_name"
                  size="sm"
                  placeholder="Tapper Prénom"
                  :state="handleState('last_name')"
                  @input="clearFormError('last_name')"
              />
              <HasError
                  :form="form"
                  field="last_name"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
                label="Email"
                label-for="email"
            >
              <b-form-input
                  id="email"
                  v-model="form.email"
                  size="sm"
                  placeholder="Tapper Email"
                  :state="handleState('email')"
                  @input="clearFormError('email')"
              />
              <HasError
                  :form="form"
                  field="email"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
                label="Password"
                label-for="password"
            >
              <b-input-group
                  class="input-group-merge"
                  :class="{'is-invalid':form.errors.has('password')}"
              >
                <b-form-input
                    id="password"
                    v-model="form.password"
                    :type="passwordFieldType"
                    size="sm"
                    placeholder="Tapper Password"
                    :state="handleState('password')"
                    @input="clearFormError('password')"
                />
                <b-input-group-append is-text>
                  <feather-icon
                      :icon="passwordToggleIcon"
                      class="cursor-pointer"
                      @click="togglePasswordVisibility"
                  />
                </b-input-group-append>
              </b-input-group>
              <HasError
                  :form="form"
                  field="password"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
                label="Role"
                label-for="role"
            >
              <v-select
                  v-model="form.role"
                  input-id="role"
                  placeholder="choisir ..."
                  label="name"
                  :reduce="item => item.name"
                  :options="RoleOption"
                  :state="handleState('role')"
                  class="select-size-sm"
                  @input="clearFormError('role')"
              />
              <HasError
                  :form="form"
                  field="role"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
                label="Etat du compte"
                label-for="status"
            >
              <v-select
                  v-model="form.status"
                  input-id="status"
                  placeholder="choisir ..."
                  label="label"
                  :reduce="item => item.value"
                  :options="StatusOption"
                  class="select-size-sm"
                  @input="clearFormError('status')"
              />
              <HasError
                  :form="form"
                  field="status"
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
  BModal, BForm, BRow, BCol, BFormInput, BFormGroup, BInputGroupAppend, BInputGroup,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import {togglePasswordVisibility} from '@core/mixins/ui/forms'
import store from '@/store'
import Form from 'vform'
import {HasError} from 'vform/src/components/bootstrap5'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {$statusOption} from '@/OtherConfig'


export default {
  name: 'UserModal',
  components: {
    BModal,
    BForm,
    BRow,
    BCol,
    BFormGroup,
    BInputGroupAppend,
    BInputGroup,
    BFormInput,
    vSelect,
    HasError,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      ModalSync: false,
      title: '',
      RoleOption: [],
      StatusOption: $statusOption,
      form: new Form({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        status: '',
        role: '',
      }),
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  created() {
    this.$root.$on('user-modal-sync', user => {
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      this.fetchRoles()
      this.title = 'Ajouter Un Utilisateur'
      if (user) {
        this.form.fill(user)
        this.title = 'Modification : ' + this.form.first_name + ' ' + this.form.last_name
      }

    })
  },
  methods: {
    fetchRoles() {
      store.dispatch('rolesStore/fetchRoles').then(res => {
        this.RoleOption = res.data
      })
    },
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.form.id ? this.editUser() : this.addUser()
    },
    addUser() {
      store.dispatch('usersStore/addUser', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.toastNotification(res.data.msg, 'User', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    editUser() {
      store.dispatch('usersStore/editUser', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.toastNotification(res.data.msg, 'User', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
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
  },
}
</script>
