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
              label-for="name"
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
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Action"
              label-for="action"
            >
              <b-form-input
                id="action"
                v-model="form.action"
                size="sm"
                placeholder="Tapper Action"
                :state="handleState('action')"
                @input="form.errors.clear('action')"
              />
              <HasError
                :form="form"
                field="action"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Resource"
              label-for="Resource"
            >
              <div class="d-flex">
                <b-col
                  v-if="!enableAdd"
                  class="mr-2 p-0"
                  md="12"
                >
                  <v-select
                    v-model="form.subject"
                    input-id="subject"
                    placeholder="choisir ..."
                    label="label"
                    :options="Resourcefilter"
                    class="select-size-sm"
                    @input="form.errors.clear('subject')"
                  />
                  <HasError
                    :form="form"
                    field="subject"
                  />
                </b-col>
                <b-col
                  v-else
                  class="mr-2 p-0"
                  md="10"
                >
                  <b-form-input
                    v-model="newResource"
                    size="sm"
                    placeholder="Tapper Action"
                  />
                </b-col>
                <b-col md="2">
                  <b-button
                    variant="outline-primary"
                    class="btn-icon rounded-circle"
                    size="sm"
                    @click.prevent="AddResource"
                  >
                    <feather-icon :icon="enableAdd ? 'CheckIcon' : 'PlusIcon'" />
                  </b-button>
                </b-col>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal, BForm, BRow, BCol, BFormInput, BFormGroup, BButton,
} from 'bootstrap-vue'
import Form from '@core/auth/jwt/vformAxios'
import { HasError } from 'vform/src/components/bootstrap5'
import store from '@/store'

const R = require('ramda')

export default {
  name: 'PermissionsModal',
  components: {
    BModal,
    BForm,
    BRow,
    BCol,
    BFormGroup,
    BButton,
    BFormInput,
    HasError,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['subject'],
  data() {
    return {
      ModalSync: false,
      title: '',
      form: new Form({
        id: '',
        name: '',
        subject: '',
        action: '',
      }),
      newResource: '',
      enableAdd: false,
    }
  },
  computed: {
    Resourcefilter() {
      return R.uniq(this.subject)
    },
  },
  created() {
    this.$root.$on('permissions-modal', permission => {
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      this.title = 'Ajouter Une Permission'
      if (permission) {
        this.form.fill(permission)
        this.title = `Modifictaion : ${permission.name}`
      }
    })
  },
  methods: {
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.form.id ? this.editPermission() : this.addPermission()
    },
    addPermission() {
      store.dispatch('permissionsStore/addPermission', this.form).then(() => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    editPermission() {
      store.dispatch('permissionsStore/editPermission', this.form).then(() => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    AddResource() {
      this.enableAdd = !this.enableAdd
      if (this.newResource) {
        this.subject.push(this.newResource.toString())
      }
      this.newResource = ''
    },
    handleState(field) {
      return this.form.errors.has(field) ? false : null
    },
  },
}
</script>
