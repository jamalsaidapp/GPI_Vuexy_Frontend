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
            <b-button
              v-for="(btn, index) in actionsButtons"
              :key="index"
              v-b-tooltip.hover.top="btn.tooltip"
              :variant="btn.variant"
              class="btn-icon rounded-circle mr-1"
              size="sm"
              @click="btn.command"
            >
              <feather-icon :icon="btn.icon" />
            </b-button>
            <b-button
              v-if="hasExport"
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
              v-if="hasDeletedFilter"
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
        v-for="col in columns"
        :key="col.field"
        v-bind="col"
        :show-filter-operator="false"
      >
        <template
          v-if="col.hasComponent"
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
          {{ data[col.field] }}
        </template>
        <template
          v-if="col.filtered"
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
  BButton, BFormInput, BCol, BInputGroup, BInputGroupPrepend, BFormCheckbox, VBTooltip,
} from 'bootstrap-vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import ContextMenu from 'primevue/contextmenu'

// import 'primevue/resources/themes/saga-blue/theme.css'
// import 'primevue/resources/themes/tailwind-light/theme.css'
import 'primevue/resources/themes/fluent-light/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// import FilterMatchMode from 'primevue/api/FilterMatchMode'
// import FilterOperator from 'primevue/api/FilterOperator'

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
      default: false,
    },
    hasFilter: {
      required: false,
      type: Boolean,
      default: false,
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
        // first_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      },
      selectedRows: [],
      selectedRow: null,
      expandedRows: [],
      selectedColumns: null,
      WithTrashed: false,
      data: null,
    }
  },
  computed: {},
  watch: {
    selectedRows(newValue) {
      this.$emit('selected-rows', newValue)
    },
    selectedRow(newValue) {
      this.$emit('selected-row', newValue)
    },
    tableData(newVal) {
      if (this.WithTrashed === false) this.data = this.tableData
      else this.data = newVal.filter(row => row.deleted_at === null)
    },
    WithTrashed(newVal) {
      if (newVal) this.data = this.tableData.filter(row => row.deleted_at !== null)
      else this.data = this.tableData.filter(row => row.deleted_at === null)
    },
  },
  created() {
    // this.data = this.tableData
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
      const vm = this
      vm.$refs.cm.show(event.originalEvent)
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
  padding: 4px 5px !important;
}
.p-datatable .p-column-header-content {
  justify-content: center;
}
.p-datatable .p-datatable-tbody > tr:focus, .p-datatable .p-datatable-tbody > tr:hover {
  outline: 1px solid #0f629f;
  outline-offset: -1px;
}
.p-menuitem.p-menuitem-active:hover {
  outline: 1px solid #0f629f;
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
</style>
