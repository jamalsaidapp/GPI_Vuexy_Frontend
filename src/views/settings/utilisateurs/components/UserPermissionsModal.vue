<template>
  <div>
    <b-modal
        ref="PermissionsModal"
        v-model="ModalSync"
        :title="title"
        centered
        ok-title="Enregistrer"
        cancel-title="Férmer"
        button-size="sm"
        no-close-on-backdrop
        @ok="submit"
    >
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
                  @input="groupedByname"
              />
            </b-col>

          </b-row>
          <b-row class="permission_scrl pl-1 mx-auto mb-1">
            <b-spinner v-if="loadingPerms" class="m-auto" variant="primary" label="Loading..."></b-spinner>
            <b-form-checkbox-group v-else
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
          <span> Total Permissions Selectioner : <span class="font-weight-bold">{{
              form.permissions.length
            }}</span></span>
        </b-form-group>
      </b-col>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal, BForm, BRow, BCol, BFormInput, BFormGroup, BFormCheckboxGroup, BSpinner,
} from 'bootstrap-vue'
import Form from 'vform'
import {HasError} from 'vform/src/components/bootstrap5'
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import vSelect from 'vue-select'
import store from "@/store";

const R = require('ramda')

export default {
  name: 'UserPermissionsModal',
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
    BSpinner
  },
  data() {
    return {
      ModalSync: false,
      title: 'Modification Des Permissions',
      userId: '',
      loadingPerms: false,
      form: new Form({
        id: '',
        permissions: [],
      }),
      InitialPermissions: [],
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
    this.$root.$on('user-permissions-modal-sync', id => {
      this.form.clear()
      this.form.reset()
      this.form.id = id
      this.getUserPermissions(id)
      this.ModalSync = !this.ModalSync
    })
  },
  methods: {
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.setUserPermissions()
    },
    async getUserPermissions() {
      this.loadingPerms = true
      await store.dispatch('permissionsStore/getUserPermissions', this.form.id).then(res => {
        this.form.permissions = R.pluck('name')(res.data.permissions)
        this.InitialPermissions = res.data.initialPerms
        this.permsName = R.pluck('name')(this.InitialPermissions)
        this.loadingPerms = false
      })
    },
    setUserPermissions(){
      store.dispatch('permissionsStore/setUserPermissions', this.form)
    },
    groupedByname() {
      const GroupedPerms = this.InitialPermissions.filter(perm => perm && perm.subject.includes(this.selectedResource))
      this.permsName = R.pluck('name')(GroupedPerms)
      if (!this.selectedResource) this.permsName = R.pluck('name')(this.InitialPermissions)
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
