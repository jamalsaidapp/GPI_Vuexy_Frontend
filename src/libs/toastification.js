import Vue from 'vue'
import Toast from 'vue-toastification'

// Toast Notification Component Styles
import '@core/scss/vue/libs/toastification.scss'

import ToastificationContent from '@core/components/toastification/ToastificationContent'

/**
 * NOTE: If you are using other transition them make sure to import it in `src/@core/scss/vue/libs/notification.scss` from it's source
 */
Vue.use(Toast, {
  hideProgressBar: true,
  closeOnClick: false,
  closeButton: false,
  icon: false,
  timeout: 3000,
  transition: 'Vue-Toastification__fade',
})

// eslint-disable-next-line import/prefer-default-export
export const toastNotification = (text, icon, variant) => {
  Vue.$toast({
    component: ToastificationContent,
    props: {
      text,
      icon: `${icon}Icon`,
      variant: variant !== 'success' ? variant : 'success',
    },
  },
  {
    position: 'top-center',
  })
}
