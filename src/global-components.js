import Vue from 'vue'
import FeatherIcon from '@core/components/feather-icon/FeatherIcon'
import vSelect from 'vue-select'
import '@core/scss/vue/libs/vue-select.scss'

import PrimeVue from 'primevue/config'

Vue.component('v-select', vSelect)
Vue.component(FeatherIcon.name, FeatherIcon)

Vue.use(PrimeVue)

Vue.component('JDatatable', () => import('@/myCompenents/JDatatable'))

Vue.directive('uppercase', {
  update(el) {
    el.value = el.value.toUpperCase()
  },
})
