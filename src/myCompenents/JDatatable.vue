<template>
  <div>
    <DataTable
        class="p-datatable-gridlines p-datatable-hoverable-rows p-datatable-sm"
        :value="hasDeletedFilter ? FilterTrashed : tableData"
        removable-sort
        :selection.sync="selectedRows"
        :data-key="DataKey"
        :paginator="true"
        :rows="5"
        :resizable-columns="true"
        column-resize-mode="fit"
        :loading="isloading"
        :filters="filters"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5,10,30,100]"
        :current-page-report-template="'Affichage {first} à {last} de {totalRecords} ' + tableName"
        :expandedRows="expandedRows"
        @row-expand="onRowExpand"
        @row-collapse="onRowCollapse"
        :row-class="hasDeletedFilter ? FilterDeletedRows : ''"
    >
      <template #header>
        <div class="table-header mb-1">
          <b-col md="auto" class="pl-0">
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon"/>
              </b-input-group-prepend>
              <b-form-input
                  v-model="filters['global']"
                  size="sm"
                  placeholder="Recherche..."
                  type="search"
              />
            </b-input-group>
          </b-col>
          <b-col md="auto" class="pr-0">
            <b-button
                v-if="hasExport"
                variant="gradient-success"
                class="btn-icon rounded-circle mr-1"
                size="sm"
                @click="exportExcel"
            >
              <feather-icon icon="ShareIcon"/>
            </b-button>
            <b-button
                v-if="hasSelection"
                variant="gradient-danger"
                class="btn-icon rounded-circle mr-1"
                :disabled="!selectedRows.length > 0"
                size="sm"
                @click="deleteAllFunction"
            >
              <feather-icon icon="Trash2Icon"/>
            </b-button>
            <slot name="action_table"/>
            <b-form-checkbox
                v-model="WithTrashed"
                class="custom-control-primary fix_postion"
                name="check-button"
                switch
                v-if="hasDeletedFilter"
            >
        <span class="switch-icon-left">
          <feather-icon icon="Trash2Icon"/>
        </span>
              <span class="switch-icon-right">
          <feather-icon icon="TrashIcon"/>
        </span>
            </b-form-checkbox>
          </b-col>
        </div>
      </template>

      <Column
          v-if="hasSelection"
          selection-mode="multiple"
          header-style="width: 3em"
      />

      <Column v-if="hasExpansion" :expander="true" headerStyle="width: 3rem"/>

      <Column
          v-for="col in columns"
          :key="col.field"
          v-bind="col"
      />

      <template v-if="customCols.length > 0 && hasCustomCols">
        <Column
            v-for="col in customCols"
            :key="col.field"
            v-bind="col"
            style="'width: 100px'"
        >
          <template #body="slotProps">
            <slot
                :props="slotProps.data[col.field]"
                :field="col.field"
                name="custom_cols"
            />
          </template>
        </Column>
      </template>

      <Column
          v-if="hasActions"
          field="actions"
          header="Actions"
      >
        <template #body="slotProps">
          <slot
              :props="slotProps.data"
              name="actions_button"
          />
        </template>
      </Column>

      <template #empty>
        <span v-if="!WithTrashed">Aucun element trouver</span>
        <span v-else>Aucun element supprimer</span>
      </template>

      <template
          v-if="selectedRows.length > 0"
          #footer
      >
        <span> {{ selectedRows.length }} lignes Séléctionner</span>
      </template>

      <template #expansion="slotProps">
        <slot name="expand" :props="slotProps.data"></slot>
      </template>
    </DataTable>
  </div>
</template>

<script>
import {
  BButton, BFormInput, BCol, BInputGroup, BInputGroupPrepend, BDropdown, BFormCheckbox
} from 'bootstrap-vue'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'


const R = require('ramda')

export default {
  name: 'JDatatable',
  components: {
    BButton,
    DataTable,
    Column,
    InputText,
    BFormInput,
    BCol,
    BInputGroup,
    BInputGroupPrepend,
    BDropdown,
    BFormCheckbox,
  },
  props: {
    tableName: {
      required: true,
      type: String,
    },
    DataKey: {
      required: false,
      type: String,
      default() {
        return 'id'
      },
    },
    tableData: {
      required: true,
      type: Array,
      default() {
        return []
      },
    },
    columns: {
      required: true,
      type: Array,
      default() {
        return []
      },
    },
    customCols: {
      required: false,
      type: Array,
      default() {
        return []
      },
    },
    hasPaginator: {
      required: false,
      type: Boolean,
      default: true,
    },
    isloading: {
      required: false,
      type: Boolean,
      default: false,
    },
    hasSelection: {
      required: false,
      type: Boolean,
      default: false,
    },
    hasExpansion: {
      required: false,
      type: Boolean,
      default: false,
    },
    hasExport: {
      required: false,
      type: Boolean,
      default: false,
    },
    hasActions: {
      required: false,
      type: Boolean,
      default: true,
    },
    hasCustomCols: {
      required: false,
      type: Boolean,
      default: true,
    },
    hasDeletedFilter: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filters: {},
      selectedRows: [],
      expandedRows: [],
      selectedColumns: null,
      WithTrashed: false,
    }
  },
  computed: {
    optionsColheader() {
      return R.map(R.path(['header']))(this.columns.concat(this.customCols)).filter(opt => this.SelectedColName.indexOf(opt) === -1)
    },
    SelectedColfield() {
      return R.map(R.path(['field']))(this.columns).filter(opt => this.SelectedColName.indexOf(opt) === -1)
    },
    FilterTrashed() {
      if (!this.WithTrashed)
        return this.tableData.filter(row => {
          return row.deleted_at === null
        })
      return this.tableData.filter(row => {
        return row.deleted_at !== null
      })
    },
  },
  watch: {
    selectedRows(newValue) {
      this.$emit('selected-rows', newValue)
    },
  },
  methods: {
    deleteAllFunction() {
      this.$emit('delete-all', R.pluck(this.DataKey)(this.selectedRows))
    },
    exportExcel() {
      this.$emit('export-excel')
    },
    onRowExpand(event) {
      this.expandedRows = this.tableData.filter(p => p[this.DataKey] === event.data[this.DataKey])
    },
    onRowCollapse(event) {
      if (event.data) this.expandedRows = null
    },
    FilterDeletedRows(data) {
      return data.deleted_at !== null ? 'bg-red' : ''
    },

  },
}
</script>

<style>
.bg-red {
  background: #f7cbcb !important;
}

.fix_postion {
  float: left;
  margin: 3px 8px 0 0;
}
</style>
