<template>
  <div>
    <b-modal
      ref="AffectationModal"
      v-model="ModalSync"
      :title="fullName"
      centered
      ok-only
      ok-title="Férmer"
      button-size="sm"
      no-close-on-backdrop
      hide-footer
      :size="isLarge ? 'lg': ''"
    >
      <b-tabs
        v-if="isMulti"
        pills
        vertical
      >
        <b-tab
          v-for="(item, index) in salaryData"
          :key="index"
          :title="item.sn"
          :active="index === 0"
        >
          <b-list-group>
            <b-list-group-item :class="classItem">
              <span>Réference :</span><span>{{ item.reference }}</span>
            </b-list-group-item>
            <b-list-group-item :class="classItem">
              <span>Numéro du Serie : </span>  <span>{{ item.sn }}</span>
            </b-list-group-item>
            <b-list-group-item :class="classItem">
              <span>Ram : </span> <span>{{ item.ram }} </span>
            </b-list-group-item>
            <b-list-group-item :class="classItem">
              <span>Processeur : </span> <span>{{ item.processor }}</span>
            </b-list-group-item>
            <b-list-group-item :class="classItem">
              <span>Etat du PC : </span> <span>{{ item.state }}</span>
            </b-list-group-item>
            <b-list-group-item :class="classItem">
              <span>Date d'affectation : </span> <span>{{ item.pivot.affected_at }} </span>
            </b-list-group-item>
            <b-list-group-item
              v-if="item.pivot.remarque"
              :class="classItem"
            >
              <span>Remarque : </span> <span>{{ item.pivot.remarque }} </span>
            </b-list-group-item>
          </b-list-group>
        </b-tab>
      </b-tabs>
      <b-list-group v-else>
        <div v-if="laptop">
          <b-list-group-item :class="classItem">
            <span>Réference :</span><span>{{ laptop.reference }}</span>
          </b-list-group-item>
          <b-list-group-item :class="classItem">
            <span>Numéro du Serie : </span>  <span>{{ laptop.sn }}</span>
          </b-list-group-item>
          <b-list-group-item :class="classItem">
            <span>Ram : </span> <span>{{ laptop.ram }} </span>
          </b-list-group-item>
          <b-list-group-item :class="classItem">
            <span>Processeur : </span> <span>{{ laptop.processor }}</span>
          </b-list-group-item>
          <b-list-group-item :class="classItem">
            <span>Etat du PC : </span> <span>{{ laptop.state }}</span>
          </b-list-group-item>
          <b-list-group-item :class="classItem">
            <span>Date d'affectation : </span> <span>{{ laptop.pivot.affected_at }} </span>
          </b-list-group-item>
          <b-list-group-item
            v-if="laptop.pivot.remarque"
            :class="classItem"
          >
            <span>Remarque : </span> <span>{{ laptop.pivot.remarque }} </span>
          </b-list-group-item>
        </div>
      </b-list-group>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal, BTabs, BTab, BListGroup, BListGroupItem,

} from 'bootstrap-vue'

export default {
  name: 'ListOrdinateurAffecterModal',
  components: {
    BModal, BTabs, BTab, BListGroup, BListGroupItem,
  },
  data() {
    return {
      ModalSync: false,
      dataModal: null,
      classItem: 'd-flex justify-content-between align-items-center',
      isLarge: false,
      isMulti: false,
    }
  },
  computed: {
    salaryData() {
      return this.dataModal?.affected_laptops
    },
    fullName() {
      return this.dataModal?.full_name
    },
    laptop() {
      return this.dataModal?.affected_laptops[0]
    },
  },
  watch: {
    dataModal(newValue) {
      this.isLarge = !!newValue.affected_laptops.find(item => item.pivot.remarque !== null)
    },
  },
  created() {
    this.$root.$on('list-affectation-modal-trigger', data => {
      this.ModalSync = !this.ModalSync
      this.dataModal = data
      this.isMulti = this.dataModal?.affected_laptops.length > 1
    })
  },
  methods: {

  },
}
</script>
<style>
.nav.nav-pills.flex-column{
  margin-top: 11px;
}
.nav.nav-pills.flex-column >li >a{
  border: 1px solid #e3e4e5;
  margin-bottom: 5px;
}
.tabs.row >div:nth-child(1){
  border: 1px solid #e3e4e5;
  border-radius: 5px;
}

</style>
