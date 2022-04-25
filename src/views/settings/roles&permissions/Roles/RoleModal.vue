<template>
  <div>
    <b-modal
      ref="RoleModal"
      v-model="ModalSync"
      :title="title"
      centered
      :ok-title="form.id ? 'Modifier' : 'Ajouter'"
      cancel-title="Férmer"
      button-size="sm"
      no-close-on-backdrop
      size="md"
      @ok="submit"
    >
      <b-form @submit.prevent>
        <b-row class="mt-1">
          <b-col md="12">
            <b-row>
              <b-form-group
                label="Nom du Role"
                label-for="name"
                class="w-100"
              >
                <b-form-input
                  id="nom"
                  v-model="form.name"
                  size="sm"
                  placeholder="Tapper Nom"
                  :state="handleState('name')"
                  @input="form.errors.clear('name')"
                />
                <HasError
                  :form="form"
                  field="name"
                />
              </b-form-group>
            </b-row>
            <grouped-permissions
              :permissions="InitialPermissions"
              :checked-permissions="form.permissions"
            />
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal, BForm, BRow, BCol, BFormInput, BFormGroup,
} from 'bootstrap-vue'
import Form from 'vform'
import { HasError } from 'vform/src/components/bootstrap5'
import store from '@/store'
import { toastNotification } from '@/libs/toastification'
import GroupedPermissions from '@/views/settings/utilisateurs/components/GroupedPermissions'

const R = require('ramda')

export default {
  name: 'RoleModal',
  components: {
    BModal,
    BForm,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    HasError,
    GroupedPermissions,
  },
  props: ['InitialPermissions'],
  data() {
    return {
      ModalSync: false,
      title: '',
      form: new Form({
        id: '',
        name: '',
        permissions: [],
      }),
    }
  },

  created() {
    this.$root.$on('role-modal-sync', role => {
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      this.title = 'Ajouter Un Role'
      if (role) {
        this.form.fill(role)
        this.form.permissions = R.pluck('name')(role.permissions)
        this.title = `Modification : ${role.name}`
      }
    })
    this.$root.$on('on-permissions-change', permissions => {
      this.form.permissions = permissions
    })
  },
  methods: {
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.form.id ? this.editRole() : this.addRole()
    },
    addRole() {
      store.dispatch('rolesStore/addRole', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            toastNotification(res.data.msg, 'Role', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    editRole() {
      store.dispatch('rolesStore/editRole', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            toastNotification(res.data.msg, 'Role', 'success')
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

<style lang="scss">

</style>
