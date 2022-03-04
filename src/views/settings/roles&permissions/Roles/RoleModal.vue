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
        size="sm"
        @ok="submit"
    >
      <b-form @submit.prevent>
        <b-row class="mt-1">
          <b-col md="12">
            <b-form-group
                label="Nom du Role"
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
          <b-col md="12">
            <b-form-group
                label="Permissions Affecter"
                label-for="Permissions"
            >
              <b-row>
                <b-col md="6">
                  <b-form-input
                      v-model="searchPerms"
                      size="sm"
                      placeholder="Recherche ..."
                      class="mb-1"
                  />
                </b-col>
                <b-col md="6">
                  <v-select
                      v-model="selectedResource"
                      placeholder="Grouper Par ..."
                      label="label"
                      :options="permsResource"
                      class="select-size-sm"
                      @input="groupedBy"
                  />
                </b-col>

              </b-row>
              <b-row class="permission_scrl pl-1 mx-auto mb-1">
                <b-form-checkbox-group
                    id="checkbox-group-1"
                    v-model="form.permissions"
                    :options="permsName.filter(perm => perm && perm.includes(searchPerms.charAt(0).toUpperCase()))"
                    name="flavour-1"
                    size="sm"
                    class="pl-1"
                />
              </b-row>
              <HasError
                  :form="form"
                  field="permissions"
              />
              <span> Total Permissions Selectioner : <span class="font-weight-bold">{{ form.permissions.length }}</span></span>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal, BForm, BRow, BCol, BFormInput, BFormGroup, BFormCheckboxGroup,
} from 'bootstrap-vue'
import Form from 'vform'
import {HasError} from 'vform/src/components/bootstrap5'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'
import store from '@/store'
import app_rolesModule from "@/views/settings/roles&permissions/Roles/rolesStoreModule";

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
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    BFormCheckboxGroup,
    vSelect,
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
      searchPerms: '',
      selectedResource: '',
      permsName: [],
    }
  },
  computed: {
    permsResource() {
      return R.uniq(R.pluck('subject')(this.InitialPermissions))
    },
  },

  created() {
    this.$root.$on('role-modal-sync', role => {
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      // eslint-disable-next-line no-multi-assign
      this.permsName = this.selectedResource = []
      this.searchPerms = ''
      this.title = 'Ajouter Un Role'
      if (role) {
        this.form.fill(role)
        this.form.permissions = R.pluck('name')(role.permissions)
        this.title = 'Modification : ' + role.name
      }
      this.permsName = R.pluck('name')(this.InitialPermissions)
    })
  },
  methods: {
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.form.id ? this.editRole() : this.addRole()
    },
    addRole() {
      store.dispatch('app_roles/addRole', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.toastNotification(res.data.msg, 'Role', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    editRole() {
      store.dispatch('app_roles/editRole', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.toastNotification(res.data.msg, 'Role', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    groupedBy() {
      const GroupedPerms = this.InitialPermissions.filter(perm => perm && perm.subject.includes(this.selectedResource))
      this.permsName = R.pluck('name')(GroupedPerms)
      if (!this.selectedResource) this.permsName = R.pluck('name')(this.InitialPermissions)
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

.custom-checkbox.b-custom-control-sm, .input-group-sm .custom-checkbox {
  padding-left: 0.3125rem;
}

.custom-control-inline {
  margin-right: 2rem;
}

.permission_scrl {
  height: 70px;
  overflow-y: scroll;
  border: 1px solid #d8dfe4;
}
</style>
