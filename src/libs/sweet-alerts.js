import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2/dist/sweetalert2'
import store from '@/store'

Vue.use(VueSweetalert2)

// eslint-disable-next-line import/prefer-default-export
export const ConfirmDelete = (actionsType, data) => {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Supprimer !',
    cancelButtonText: 'Annuler',
    width: '22rem',
    customClass: {
      header: 'delete-header',
      confirmButton: 'btn btn-sm btn-primary',
      cancelButton: 'btn btn-sm btn-outline-danger ml-1',
    },
    buttonsStyling: false,
  }).then(result => { if (result.value) store.dispatch(actionsType, data).then(() => {}) })
}

// eslint-disable-next-line import/prefer-default-export
export const ConfirmRestore = (actionsType, data) => {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Restaurer !',
    cancelButtonText: 'Annuler',
    width: '22rem',
    customClass: {
      header: 'delete-header',
      confirmButton: 'btn btn-sm btn-primary',
      cancelButton: 'btn btn-sm btn-outline-default ml-1',
    },
    buttonsStyling: false,
  }).then(result => { if (result.value) store.dispatch(actionsType, data).then(() => {}) })
}
