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
                @input="clearFormError('name')"
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
                @input="clearFormError('action')"
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
                    @input="clearFormError('subject')"
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
import vSelect from 'vue-select'
import Form from 'vform'
import { HasError } from 'vform/src/components/bootstrap5'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
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
    vSelect,
    HasError,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
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
      if (permission.id) {
        this.form.fill(permission)
        this.title = 'Modifictaion : ' + permission.name
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
      store.dispatch('permissionsStore/addPermission', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.toastNotification(res.data.msg, 'Permissions', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    editPermission() {
      store.dispatch('permissionsStore/editPermission', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.toastNotification(res.data.msg, 'Permissions', 'success')
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

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
