<template>
<div>
  <b-list-group v-for="ordinateur in ordinateurs"
                :key="ordinateur.id" horizontal="md"
                class="text-xs"
  >

    <b-list-group-item style="padding: 0 7px;"><span class="text-bold font-weight-bold">Marque : </span>
      <img style="height: 35px; width: 68px;" :src="resolveMarque(ordinateur.marque)" alt="marque">
    </b-list-group-item>
    <b-list-group-item><span class="text-bold font-weight-bold">Réference : </span> {{ordinateur.reference}}</b-list-group-item>
    <b-list-group-item><span class="text-bold font-weight-bold">Numéro du Serie : </span> {{ordinateur.sn}}</b-list-group-item>
    <b-list-group-item><span class="text-bold font-weight-bold">Ram : </span> {{ordinateur.ram}}</b-list-group-item>
    <b-list-group-item><span class="text-bold font-weight-bold">Processeur : </span> {{ordinateur.processor}}</b-list-group-item>
    <b-list-group-item><span class="text-bold font-weight-bold">Etat du PC : </span> {{ordinateur.state}}</b-list-group-item>
    <b-list-group-item><span class="text-bold font-weight-bold">Date d'affectation : </span> {{ordinateur.pivot.affected_at}}</b-list-group-item>
    <b-list-group-item>
      <b-button
          variant="gradient-success"
          class="btn-icon rounded-circle mr-1 fixpos"
          size="sm"
          @click="OpenUpdateAffectationModal(ordinateur)"
      >
        <feather-icon icon="EditIcon"/>
      </b-button>
      <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle fixpos"
          size="sm"
      >
        <feather-icon icon="Trash2Icon"/>
      </b-button>
    </b-list-group-item>
  </b-list-group>
</div>
</template>

<script>
import {BListGroup, BListGroupItem,BButton} from "bootstrap-vue";

export default {
  name: 'ListOrdinateurAffecter',
  components:{
    BListGroup,
    BListGroupItem,
    BButton,
  },
  props:['ordinateurs'],
  methods:{
    resolveMarque(marque) {
      if (marque === 'Lenovo') return require('@/assets/images/marques_pc/lenovo.png')
      if (marque === 'HP') return require('@/assets/images/marques_pc/hp.png')
      if (marque === 'Acer') return require('@/assets/images/marques_pc/acer.png')
      if (marque === 'Dell') return require('@/assets/images/marques_pc/dell.png')
      if (marque === 'Asus') return require('@/assets/images/marques_pc/asus.png')
      if (marque === 'Fujitsu') return require('@/assets/images/marques_pc/fujitsu.png')
      if (marque === 'Toshiba') return require('@/assets/images/marques_pc/toshiba.png')
    },
    OpenUpdateAffectationModal(affectation) {
      this.$root.$emit('update-affectation-modal-sync', affectation)
    },

  }
}
</script>

<style scoped>
.list-group-item {
  padding: 5px 14px 0px 10px;
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
</style>