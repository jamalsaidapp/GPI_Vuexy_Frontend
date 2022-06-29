<template class="mx-auto">
  <b-row>
    <b-spinner
      v-if="loadingPerms"
      class="m-auto"
      variant="primary"
    />
    <div
      v-else
      style="width: 100%"
    >
      <b-row>
        <b-col md="6">
          <b-form-input
            v-model="searchPerms"
            size="sm"
            placeholder="Recherche ..."
            class="mb-1"
            type="search"
            @input="onPermsSearch"
          />
        </b-col>
        <b-col md="6">
          <b-button
            variant="gradient-primary"
            size="sm"
            class="mr-1"
            @click="resetDefaultCheckedPerms"
          >
            Reset
          </b-button>
          <b-button
            variant="gradient-danger"
            size="sm"
            class="mr-1"
            @click="clearAllSelectedPerms"
          >
            Clear
          </b-button>
          <b-button
            :variant="isExpanded ? 'outline-secondary' : 'outline-success'"
            size="sm"
            class="btn-icon mr-1"
            @click.prevent="handleExpand()"
          >
            <feather-icon
              v-if="isExpanded"
              icon="Minimize2Icon"
            />
            <feather-icon
              v-else
              icon="Maximize2Icon"
            />
          </b-button>

        </b-col>
      </b-row>
      <b-row class="permission_scrl mx-auto mb-1">
        <el-tree
          ref="permsTree"
          :data="PermissionsBySubject"
          show-checkbox
          node-key="name"
          :default-expanded-keys="expendedKeys"
          :default-checked-keys="checkedPermissions"
          :props="permissionProps"
          :expand-on-click-node="false"
          check-on-click-node
          :filter-node-method="filterNode"
          @check-change="handleCheckChange"
        />
      </b-row>
    </div>
  </b-row>
</template>

<script>
import { Tree } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/fr'
import locale from 'element-ui/lib/locale'
import {
  BButton, BCol, BFormInput, BRow, BSpinner,
} from 'bootstrap-vue'

locale.use(lang)
const R = require('ramda')

export default {
  name: 'GroupedPermissions',
  components: {
    'el-tree': Tree, BSpinner, BRow, BFormInput, BCol, BButton,
  },
  props: {
    permissions: {
      required: true,
      type: Array,
    },
    checkedPermissions: {
      required: true,
      type: Array,
    },
    permissionsViaRoles: {
      required: false,
      type: Array,
      default() {
        return []
      },
    },
    loadingPerms: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      permissionProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled',
      },
      expendedKeys: ['Tout Sélectionner'],
      selectedPerms: [],
      permsSubject: [],
      searchPerms: '',
      isExpanded: false,
    }
  },
  computed: {
    PermissionsBySubject() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.permsSubject = R.uniq(this.permissions.map(p => p.subject))

      const permsSubViaRole = R.uniq(this.permissionsViaRoles.map(p => p.subject))
      const PermsSubDirect = R.difference(this.permsSubject, permsSubViaRole)
      const allPerms = []

      permsSubViaRole.forEach(sub => allPerms.push({ name: sub, disabled: true, children: this.getPermissionsBySubject(this.permissions, sub, true) }))
      PermsSubDirect.forEach(sub => allPerms.push({ name: sub, disabled: false, children: this.getPermissionsBySubject(this.permissions, sub) }))

      return [{ id: -1, name: 'Tout Sélectionner', children: R.uniq(allPerms) }]
    },
  },
  watch: {
    searchPerms(val) {
      this.$refs.permsTree.filter(val)
    },
  },
  mounted() {
  },
  methods: {
    handleCheckChange() {
      this.selectedPerms = (this.$refs.permsTree.getCheckedKeys()).filter(p => !this.permsSubject.includes(p))
      this.$root.$emit('on-permissions-change', this.selectedPerms)
    },
    getPermissionsBySubject(perms, subject, disableIt = false) {
      const tmp = perms.filter(p => p.subject === subject)
      const normPerms = []
      tmp.forEach(p => { normPerms.push({ id: p.id, name: p.name, disabled: disableIt }) })
      return normPerms
    },
    filterNode(value, data) {
      if (!value) return true
      return (data.name.toLowerCase()).indexOf(value.toLowerCase()) !== -1
    },
    handleExpand(opt) {
      let val
      if (typeof opt === 'boolean') { val = opt } else { val = !this.isExpanded }
      this.permsSubject.forEach(sub => {
        this.$refs.permsTree.store.nodesMap[sub].expanded = val
        this.isExpanded = val
      })
    },
    resetDefaultCheckedPerms() {
      this.$refs.permsTree.setCheckedKeys(this.checkedPermissions)
    },
    clearAllSelectedPerms() {
      this.$refs.permsTree.setCheckedKeys(R.pluck('name')(this.permissionsViaRoles))
    },
    onPermsSearch() {
      const tmp = this.PermissionsBySubject
      this.isExpanded = tmp[0].children.some(per => per.name.toLowerCase() === this.searchPerms.toLowerCase())
      if (this.searchPerms === '') { this.handleExpand(false) }
    },
  },
}
</script>

<style lang="css" >
@import '~element-ui/lib/theme-chalk/index.css';
.el-tree-node__content {
  display: inline-flex !important;
}
/*.el-tree-node.is-expanded > .el-tree-node__children {*/
/*  display: flex;*/
/*  flex-wrap: wrap;*/
/*}*/
.permission_scrl {
  overflow-y: auto;
  max-height: 300px;
  border: 1px solid #d8dfe4;
  border-radius: 3px;
}
.el-tree__empty-text {
  position: fixed !important;
}

.el-tree-node.is-expanded:not(:first-child) >.el-tree-node__children{
  display: flex !important;
  flex-wrap: wrap;
  margin: 5px;
  border: 1px solid #d8dfe4;
  padding: 2px;
  width: 471px;
}
.el-tree-node__content{
  padding-left: 10px !important
}
</style>
