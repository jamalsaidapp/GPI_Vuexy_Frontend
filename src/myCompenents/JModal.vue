<template>
  <div>
    <b-modal
      v-model="ModalSync"

      :title="title"
      :ok-title="OkText"
      :cancel-title="CancelText"
      button-size="sm"
      no-close-on-backdrop
      :ok-disabled="OkDisabled"
      :cancel-disabled="CancelDisabled"
    />
  </div>
</template>

<script>
import {
  // BButton,
  BModal, BRow, BCol, BFormInput,
  // BFormTags, BFormTag, BFormGroup, BFormSelect,
} from 'bootstrap-vue'
import vSelect from 'vue-select'

export default {
  name: 'JModal',
  components: {
    // BButton,
    BModal,
    BRow,
    BCol,
    // BFormTags,
    // BFormTag,
    // BFormGroup,
    BFormInput,
    // BFormSelect,
    vSelect,
  },
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    OkDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    // eslint-disable-next-line vue/prop-name-casing
    CancelDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    // eslint-disable-next-line vue/prop-name-casing
    OkText: {
      type: String,
      required: false,
      default: 'Ajouter',
    },
    // eslint-disable-next-line vue/prop-name-casing
    CancelText: {
      type: String,
      required: false,
      default: 'Férmer',
    },
    items: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      ModalSync: false,
    }
  },
  created() {
    this.$parent.$on('modal-sync', () => {
      this.ModalSync = !this.ModalSync
    })
  },
}
</script>

<style scoped>

</style>
