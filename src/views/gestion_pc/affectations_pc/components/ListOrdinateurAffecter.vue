<template>
  <div style="width: 100%;">
    <b-list-group
      v-for="ordinateur in ordinateurs"
      :key="ordinateur.id"

      class="text-xs list_pc"
    >

      <b-list-group-item><span class="text-bold font-weight-bold">Marque : </span>
        <img
          style="height: 35px; width: 68px;"
          :src="resolveMarque(ordinateur.marque)"
          alt="marque"
        >
      </b-list-group-item>
      <b-list-group-item><span class="text-bold font-weight-bold">Réference : </span> {{ ordinateur.reference }}</b-list-group-item>
      <b-list-group-item><span class="text-bold font-weight-bold">Numéro du Serie : </span> {{ ordinateur.sn }}</b-list-group-item>
      <b-list-group-item><span class="text-bold font-weight-bold">Ram : </span> {{ ordinateur.ram }}</b-list-group-item>
      <b-list-group-item><span class="text-bold font-weight-bold">Processeur : </span> {{ ordinateur.processor }}</b-list-group-item>
      <b-list-group-item><span class="text-bold font-weight-bold">Etat du PC : </span> {{ ordinateur.state }}</b-list-group-item>
      <b-list-group-item><span class="text-bold font-weight-bold">Date d'affectation : </span> {{ ordinateur.pivot.affected_at }}</b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import {
  BListGroup, BListGroupItem,

} from 'bootstrap-vue'

export default {
  emit: 'update-affectation-modal-sync',
  name: 'ListOrdinateurAffecter',
  components: {
    BListGroup,
    BListGroupItem,
  },
  props: ['ordinateurs'],
  methods: {
    resolveMarque(marque) {
      if (marque === 'Lenovo') return require('@/assets/images/marques_pc/lenovo.png')
      if (marque === 'HP') return require('@/assets/images/marques_pc/hp.png')
      if (marque === 'Acer') return require('@/assets/images/marques_pc/acer.png')
      if (marque === 'Dell') return require('@/assets/images/marques_pc/dell.png')
      if (marque === 'Asus') return require('@/assets/images/marques_pc/asus.png')
      if (marque === 'Fujitsu') return require('@/assets/images/marques_pc/fujitsu.png')
      if (marque === 'Toshiba') return require('@/assets/images/marques_pc/toshiba.png')
      return false
    },
  },
}
</script>

<style lang="scss" scoped>
.list-group-item {
  padding: 0px 14px 0px 10px;
}
.list-group {
  justify-content: center;
}
.text-xs{
  font-size: 13px;
  margin-bottom: 2px;
}
.fixpos{
  bottom: 2px;
  position: relative;
}
.list_pc.list-group-item{
  width: 100%;
  line-height: 2.5 !important;
  border: unset !important;
}
.list_pc.list-group-item:nth-child(1){
  padding: 0 7px;
}
.list_pc{
  display: flex;
  flex-direction: row;
}
@media screen and (max-width: 960px){
  .list_pc{
    display: flex;
    flex-direction: column;
  }
}
</style>
