<template>
  <b-card
    no-body
    class="p-1"
  >
    <JDatatable
      table-name="SalariesPhone"
      :table-data="salaries_phones"
      :columns="columns"
      :is-loading="loading"
      :has-actions="false"
    >
      <template #action_table>
        <b-button
          variant="gradient-secondary"
          class="btn-icon rounded-circle mr-1"
          size="sm"
          @click="fetchSalaries"
        >
          <feather-icon icon="RefreshCwIcon" />
        </b-button>
        <b-button
          variant="gradient-primary"
          class="btn-icon rounded-circle"
          size="sm"
          @click="OpenSalarieModal(null)"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>

    </JDatatable>
  </b-card>
</template>

<script>
import xml2js from 'xml2js'
import store from '@/store'
import { mapGetters } from 'vuex'
import { BButton, BCard } from 'bootstrap-vue'

export default {
  components: {
    BButton, BCard,
  },
  data() {
    return {
      columns: [
        { field: 'id', header: 'PHONE ID', sortable: true },
        { field: 'name', header: 'NAME', sortable: true },
        { field: 'phone', header: 'PHONE', sortable: true },
      ],
    }
  },
  computed: {
    ...mapGetters({
      salaries: 'salariesStore/getSalaries',
      loading: 'salariesStore/getLoading',
    }),
    salaries_phones() {
      // return this.salaries.filter(item => item.phone !== null)
      //   .map(item => ({ id: item.phone.id, name: item.full_name, phone: item.phone.phonenumber }))
      return this.salaries.filter(item => item.phone_fix !== '***')
        .map(item => ({ id: item.phone_primary, name: item.full_name, phone: item.phone_fix }))
    },
  },
  created() {
    this.fetchSalaries()
  },
  mounted() {

  },
  methods: {
    fetchSalaries() {
      store.dispatch('salariesStore/fetchSalaries')
    },
    exportXML() {
      const AddressBook = [{ version: 1 }]
      this.salaries_phones.forEach(item => {
        AddressBook.push(this.serializeContact(item))
      })
      const array = { AddressBook }
      const builder = new xml2js.Builder()
      const xml = builder.buildObject(array)
      this.downloadXML(xml, 'test.xml')
    },
    serializeContact(contact) {
      return {
        Contact: [
          { FirstName: contact.name },
          { Primary: contact.id },
          {
            Phone: {
              $: { type: 'work' },
              phonenumber: contact.phone,
              accountindex: contact.id,
            },
          },
        ],
      }
    },
    downloadXML(xml, fileName) {
      const blob = new Blob([xml], { type: 'application/xml' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)
    },
  },
}
</script>

<style scoped>

</style>
