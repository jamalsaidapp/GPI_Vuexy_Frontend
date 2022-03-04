<template>
<div>
  <b-modal
      ref="OrdinateurModal"
      v-model="ModalSync"
      :title="title"
      centered
      :ok-title="form.id ? 'Modifier' : 'Ajouter'"
      cancel-title="Férmer"
      button-size="sm"
      no-close-on-backdrop
      @ok="submit"
  >
    <b-form @submit.prevent>
      <b-row class="mt-1">
        <b-col md="12">
          <b-form-group
              label="Nom Complete"
              label-for="full_name"
          >
            <b-form-input
                id="full_name"
                v-model="form.full_name"
                size="sm"
                placeholder="Tapper Prénom"
                :state="handleState('full_name')"
                @input="clearFormError('full_name')"
            />
            <HasError
                :form="form"
                field="full_name"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</div>
</template>

<script>
import {BCol, BForm, BFormGroup, BFormInput, BModal, BRow} from "bootstrap-vue";
import {HasError} from "vform/src/components/bootstrap5";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import Form from "vform";
import store from "@/store";

export default {
  name: 'SalarieModal',
  components: {
    BModal,
    BForm,
    BRow,
    BCol,
    BFormInput,
    BFormGroup,
    HasError,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  data() {
    return {
      ModalSync: false,
      title: '',
      form: new Form({
        id: '',
        full_name: '',
      }),

    }
  },
  created() {
    this.$root.$on('salarie-modal-sync', salarie => {
      this.ModalSync = !this.ModalSync
      this.form.clear()
      this.form.reset()
      this.title = 'Ajouter Un Salarie'
      if (salarie) {
        this.form.fill(salarie)
        this.title = 'Modification Salarie : ' + this.form.full_name
      }
    })
  },
  methods:{
    submit(bvModalEvt) {
      bvModalEvt.preventDefault()
      // eslint-disable-next-line no-unused-expressions
      this.form.id ? this.editOrdinateur() : this.addOrdinateur()
    },
    addOrdinateur() {
      store.dispatch('salariesStore/addSalarie', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.toastNotification(res.data.msg, 'Salarie', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    editOrdinateur() {
      store.dispatch('salariesStore/editSalarie', this.form).then(res => {
        this.$nextTick(() => {
          if (this.form.successful) {
            this.toastNotification(res.data.msg, 'Salarie', 'success')
            this.ModalSync = !this.ModalSync
          }
        })
      })
    },
    clearFormError(field) {
      this.form.errors.clear(field)
    },
    handleState(field) {
      return this.form.errors.has(field) ? false : null
    },
    toastNotification(text, icon, variant) {
      this.$toast({
            component: ToastificationContent,
            props: {
              text,
              icon: `${icon}Icon`,
              variant,
            },
          },
          {
            position: 'top-center',
          })
    },
  }
}
</script>

<style scoped>

</style>
