<template>
  <div>
    <DataTable
      ref="tableName"
      show-gridlines
      class="p-datatable-hoverable-rows p-datatable-sm"
      responsive-layout="stack"
      breakpoint="960px"
      :value="data"
      :loading="isLoading"
      :expanded-rows.sync="expandedRows"
      :data-key="dataKey"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rows-per-page-options="[5,10,30,100]"
      :current-page-report-template="'Affichage {first} à {last} de {totalRecords} ' + tableName"
      :paginator="true"
      :rows="5"
      :resizable-columns="true"
      column-resize-mode="fit"
      sort-mode="multiple"
      removable-sort
      :filters.sync="filters"
      filter-display="menu"
      :selection.sync="selectedRows"
      :row-class="hasDeletedFilter ? FilterDeletedRows : ''"
      context-menu
      :context-menu-selection.sync="selectedRow"
      @row-expand="onRowExpand"
      @row-collapse="onRowCollapse"
      @row-click="hasExpansion === true ? rowClick($event) : undefined"
      @row-contextmenu="onRowContextMenu($event)"
    >
      <template #header>
        <div class="table-header mb-1">
          <b-col
            md="auto"
            class="pr-0"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model.trim="filters['global'].value"
                size="sm"
                debounce="300"
                placeholder="Recherche..."
                type="search"
              />
            </b-input-group>
          </b-col>
          <b-col
            md="auto"
            class="button_actions pl-0"
          >
            <slot name="action_table" />
            <template v-for="(btn, index) of actionsButtons">
              <b-button
                v-if="$can(btn.permission ,tableName) || btn.permission === undefined"
                :key="index"
                v-b-tooltip.hover.top="btn.tooltip"
                :variant="btn.variant"
                class="btn-icon rounded-circle mr-1"
                size="sm"
                @click="btn.command"
              >
                <feather-icon :icon="btn.icon" />
              </b-button>
            </template>
            <b-button
              v-if="hasExport && $can('export', tableName)"
              variant="gradient-success"
              class="btn-icon rounded-circle mr-1"
              size="sm"
              @click="exportExcel"
            >
              <feather-icon icon="ShareIcon" />
            </b-button>
            <b-button
              v-if="hasSelection"
              variant="gradient-danger"
              class="btn-icon rounded-circle mr-1"
              :disabled="!selectedRows.length > 0"
              size="sm"
              @click="deleteAllFunction"
            >
              <feather-icon icon="Trash2Icon" />
            </b-button>
            <b-form-checkbox
              v-if="hasDeletedFilter && $can('trash' ,tableName)"
              v-model="WithTrashed"
              class="custom-control-primary fix_postion"
              name="check-button"
              switch
            >
              <span class="switch-icon-left">
                <feather-icon icon="Trash2Icon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="TrashIcon" />
              </span>
            </b-form-checkbox>
          </b-col>
        </div>
      </template>

      <Column
        v-if="hasSelection"
        selection-mode="multiple"
        :header-style="{'width': '2em'}"
      />

      <Column
        v-if="hasExpansion"
        :expander="true"
        :header-style="{'width': '2rem'}"
      />

      <Column
        v-for="(col, index) of selectedColumns"
        :key="index"
        v-bind="col"
      >
        <template
          v-if="col && col.hasComponent"
          #body="{data}"
        >
          <component
            :is="col.component"
            :field="col.field"
            :slot-props="data[col.field]"
          />
        </template>
        <template
          v-else
          #body="{data}"
        >
          <span v-if="col && col.field">{{ data[col.field] }}</span>
        </template>
        <template
          v-if="col && col.filtered"
          #filter="{filterModel, filterCallback}"
        >
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-inputtext-sm "
            placeholder="Search by name"
            @keydown.enter="filterCallback()"
          /></template>
      </Column>

      <Column
        v-if="hasActions"
        field="actions"
        header="Actions"
      >
        <template #body="{data}">
          <slot
            :props="data"
            name="actions_button"
          />
        </template>
      </Column>

      <template
        v-if="selectedRows.length > 0"
        #footer
      >
        <span> {{ selectedRows.length }} lignes Séléctionner</span>
      </template>

      <template #expansion="{data}">
        <slot
          name="expand"
          :props="data"
        />
      </template>

      <template #empty>
        <span v-if="!WithTrashed">Aucun element trouver</span>
        <span v-else>Aucun element supprimer</span>
      </template>

      <template #paginatorend>
        <el-select
          v-model="toggledCols"
          multiple
          collapse-tags
          size="small"
          placeholder="Select Cols"
          @change="onColToggle"
        >
          <el-option
            v-for="(item, index) of $can('read', 'extraCols') ? columns.concat(AdminCols) : columns"
            :key="index"
            :label="item.header"
            :value="item.field"
          />
        </el-select>
      </template>
    </DataTable>
    <ContextMenu
      v-if="menuOptions"
      ref="cm"
      append-to="body"
      :model="menuOptions"
    />
  </div>
</template>

<script>
import {
  BButton, BFormInput, BCol, BInputGroup, BInputGroupPrepend, BFormCheckbox, VBTooltip, BDropdown,
} from 'bootstrap-vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import ContextMenu from 'primevue/contextmenu'
import { Select, Option } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/fr'
import locale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css'
import 'primevue/resources/themes/saga-blue/theme.css'
// import 'primevue/resources/themes/tailwind-light/theme.css'
// import 'primevue/resources/themes/fluent-light/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// import FilterMatchMode from 'primevue/api/FilterMatchMode'
// import FilterOperator from 'primevue/api/FilterOperator'

locale.use(lang)

const R = require('ramda')

export default {
  name: 'JDatatable',
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BButton,
    DataTable,
    Column,
    BFormInput,
    BCol,
    BInputGroup,
    BInputGroupPrepend,
    BFormCheckbox,
    ContextMenu,
    InputText,
    BDropdown,
    'el-select': Select,
    'el-option': Option,
  },
  props: {
    actionsButtons: {
      type: Array,
    },
    tableName: {
      required: true,
      type: String,
    },
    dataKey: {
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
    hasPaginator: {
      required: false,
      type: Boolean,
      default: true,
    },
    isLoading: {
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
      default: false,
    },
    hasCustomCols: {
      required: false,
      type: Boolean,
      default: true,
    },
    hasDeletedFilter: {
      required: false,
      type: Boolean,
      default: true,
    },
    filtersList: {
      required: false,
      type: Object,
      default: () => {},
    },
    globalFilterFields: {
      required: false,
      type: Array,
      default() {
        return []
      },
    },
    menuOptions: {
      required: false,
      type: Array,
      default() {
        return null
      },
    },
  },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: 'contains' },
      },
      selectedRows: [],
      selectedRow: null,
      expandedRows: [],
      selectedColumns: this.columns,
      WithTrashed: false,
      data: null,
      AdminCols: [
        { field: 'created_at', header: 'Date Création', sortable: true },
        { field: 'created_by', header: 'Créer par', sortable: true },
        { field: 'updated_at', header: 'Date Modification', sortable: true },
        { field: 'updated_by', header: 'Modifier par', sortable: true },
        { field: 'deleted_at', header: 'Date Suppression', sortable: true },
        { field: 'deleted_by', header: 'Supprimer par', sortable: true },
      ],
      toggledCols: [],
    }
  },
  watch: {
    selectedRows(newValue) {
      this.$emit('selected-rows', newValue)
    },
    selectedRow(newValue) {
      this.$emit('selected-row', newValue)
    },
    tableData(newVal) {
      this.WithTrashed = newVal.filter(row => row.deleted_at !== null) > 0
      if (this.hasDeletedFilter) this.data = this.tableData.filter(row => row.deleted_at === null)
      else this.data = newVal
    },
    WithTrashed(newVal) {
      if (newVal) this.data = this.tableData.filter(row => row.deleted_at !== null)
      else this.data = this.tableData.filter(row => row.deleted_at === null)
    },
  },
  created() {
    this.toggledCols = this.selectedColumns.map(item => item.field)
    this.filters = { ...this.filters, ...this.filtersList }
  },
  methods: {
    rowClick(record) {
      const OldRecordData = this.expandedRows?.length ? this.expandedRows[0] : null
      this.expandedRows = []
      this.expandedRows.push(record.data)
      if (OldRecordData === record.data) {
        this.expandedRows = []
      }
    },
    deleteAllFunction() {
      this.$emit('delete-all', R.pluck(this.dataKey)(this.selectedRows))
    },
    exportExcel() {
      this.$emit('export-excel')
    },
    onRowExpand(event) {
      this.expandedRows = this.data.filter(p => p[this.dataKey] === event.data[this.dataKey])
    },
    onRowCollapse(event) {
      if (event.data) this.expandedRows = null
    },
    FilterDeletedRows(data) {
      return data.deleted_at !== null ? 'bg-red' : ''
    },
    onRowContextMenu(event) {
      const restoreOpt = this.menuOptions.find(item => item.label === 'Restaurer')
      this.menuOptions.forEach(item => {
        // eslint-disable-next-line no-param-reassign
        if (item.permission) {
          // eslint-disable-next-line no-param-reassign
          item.visible = this.$can(item.permission, this.tableName)
        }
      })
      if (restoreOpt) {
        restoreOpt.visible = !(this.selectedRow.deleted_at === null) && this.$can('restore', 'laptops')
      }
      const vm = this
      vm.$refs.cm.show(event.originalEvent)
    },
    onColToggle(ColFields) {
      const allCols = this.$can('read', 'extraCols') ? this.columns.concat(this.AdminCols) : this.columns
      const findCol = field => allCols.find(item => item.field === field)
      const tempCols = []
      ColFields.forEach(item => {
        tempCols.push(findCol(item))
      })
      this.selectedColumns = allCols.filter(col => tempCols.includes(col))
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
table .btn.btn-sm.btn-icon, table .btn-group-sm > .btn.btn-icon{
  padding: 0.3rem;
  margin-right: 0.5rem;
}
.p-contextmenu ,.p-contextmenu .p-submenu-list{
  padding: unset;
}
.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td{
  padding: 0.45rem 0.75rem !important;
}
.p-datatable.p-datatable-sm .p-datatable-thead > tr > th {
  padding: 0.6rem 0.375rem !important;
}
.p-datatable .p-column-header-content {
  justify-content: center;
}
.p-datatable .p-datatable-tbody > tr:hover {
  outline: 1px solid #0f629f !important;
  outline-offset: -1px !important;
}
.p-datatable .p-datatable-tbody > tr:focus {
  outline: 1px solid #3b759f !important;
  outline-offset: -1px !important;
}
.p-menuitem.p-menuitem-active:hover {
  outline: 1px solid #0f629f !important;
}
.table-header, .button_actions{
  display: flex;
  flex-direction: row-reverse;
}
.button_actions{
  display: flex;
  flex-direction: row;
}
.p-column-filter-menu-button.p-column-filter-menu-button-active, .p-column-filter-menu-button.p-column-filter-menu-button-active:hover {
  background: #1064a1;
  color: #fff;
  border-radius: 15px;
}
.p-datatable .p-sortable-column .p-sortable-column-badge {
  border-radius: 50%;
  background: #1064a1;
  color: #fff;
}
.p-column-filter-overlay-menu .p-column-filter-add-rule {
   padding: unset !important;
}
.p-column-filter-operator{
  display: none;
}
.p-contextmenu {
  z-index: 1030 !important
}
</style>
