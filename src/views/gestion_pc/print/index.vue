<template>
  <section class="invoice-preview-wrapper">

    <!-- Alert: No item found -->
    <b-alert
        variant="danger"
        :show="dataObject === undefined"
    >
      <h4 class="alert-heading">
        Error fetching invoice
      </h4>
      <div class="alert-body">
        No invoice found with this invoice id. Check
        <b-link
            class="alert-link"
            :to="{ name: 'apps-invoice-list'}"
        >
          Invoice List
        </b-link>
        for other invoices.
      </div>
    </b-alert>

    <b-row
        v-if=""
        class="invoice-preview"
    >
      <b-col cols="12" xl="9" md="8">
        <b-card id="element-to-print" no-body class="invoice-preview-card p-1">
          <table class="table table-bordered" >
            <tr>
              <td class="text-center" rowspan="3" style="width: 35%;">
                <logo />
              </td>
              <td rowspan="3" class="text-center text-black">
                <label class="text-black">Système Management Qualité</label>
                <hr>
                <label class=" text-black">Fiche d'Affectation Matériel Informatique </label>
              </td>
              <td class="text-center text-black" >Réf : Pc_S02_FAMI_V01</td>
            </tr>
            <tr>
              <td class="text-center text-black" >Date de
                validation : 23/10/2020
              </td>
            </tr>
            <tr>
              <td class="text-center text-black" >Date
                d'application : 23/10/2020
              </td>
            </tr>
          </table>

          <!-- Spacer -->
          <hr class="invoice-spacing m-5" style="border-color: transparent">

          <b-col class="ml-2">
            <h6 class="mb-2">√ Affectation à : <span class="font-">xxxxxxxxxxxxx</span></h6>
            <h6 class="mb-2">√ Chef De Projet : <span>xxxxxxxxxxxxx</span> </h6>
            <h6 class="mb-2">√ Projet  : <span>xxxxxxxxxxxxx</span></h6>
            <h6 class="mb-2">√ Date D'affectation : <span>xx/xx/xxxx</span> </h6>
          </b-col>

          <!-- Spacer -->
          <hr class="invoice-spacing m-6" style="border-color: transparent">

          <table class="table table-bordered">
            <thead>
            <tr class="text-center text-black">
              <th>Article</th>
              <th>S/N</th>
              <th>Date Affectation</th>
              <th>Qté</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center text-black">
              <td>xxxxxxxxxxxxxxx</td>
              <td>xxxxxx</td>
              <td>xx/xx/xxxx</td>
              <td>x</td>
            </tr>
            </tbody>
          </table>

          <!-- Spacer -->
          <hr class="invoice-spacing m-6" style="border-color: transparent">
          <hr class="invoice-spacing m-6" style="border-color: transparent">
          <hr class="invoice-spacing m-6" style="border-color: transparent">

          <table class="table table-bordered">
            <thead>
            <th class="text-center text-black" style="width: 50%;">Signature Ressource avec CIN</th>
            <th class="text-center text-black" style="width: 50%;">Signature du Responsable hiérarchique</th>
            </thead>
            <tbody>
            <tr style="height: 150px;">
              <td></td>
              <td></td>
            </tr>
            </tbody>
          </table>

        </b-card>
      </b-col>

      <b-col
          cols="12"
          md="4"
          xl="3"
          class="invoice-actions"
      >
        <b-card>


          <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              variant="primary"
              class="mb-75"
              block
              @click="print"
          >
            Print
          </b-button>

          <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              v-b-toggle.sidebar-send-invoice
              variant="outline-secondary"
              class="mb-75"
              block
          >
            Send Affectation
          </b-button>

          <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              variant="outline-secondary"
              class="mb-75"
              block
              @click="download"
          >
            Download
          </b-button>

        </b-card>
      </b-col>
    </b-row>

  </section>
</template>

<script>
import store from '@/store'
import router from '@/router'
import {
  BRow, BCol, BCard, BCardBody, BTableLite, BCardText, BButton, BAlert, BLink, VBToggle,
} from 'bootstrap-vue'
import Logo from '@core/layouts/components/Logo.vue'
import Ripple from 'vue-ripple-directive'

export default {
  directives: {
    Ripple,
    'b-toggle': VBToggle,
  },
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BTableLite,
    BCardText,
    BButton,
    BAlert,
    BLink,

    Logo,
  },
  data() {
    return {
     dataObject : []
    }
  },
  methods: {
    print() {
      window.print()
    },
    download(){
      // const { html2pdf } = require('html2pdf.js')
      // const element = document.getElementById('element-to-print');
      // html2pdf(element);
    }
  },

}
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-invoice.scss";
  table th,tr,td{
    border: 1px solid #000 !important;
  }
  table hr{
    border-top: 1px solid #000 !important;
  }
</style>

<style lang="scss">
@media print {

  // Global Styles
  body {
    background-color: transparent !important;
  }
  nav.header-navbar {
    display: none;
  }
  .main-menu {
    display: none;
  }
  .header-navbar-shadow {
    display: none !important;
  }
  .content.app-content {
    margin-left: 0;
    padding-top: 2rem !important;
  }
  footer.footer {
    display: none;
  }
  .card {
    background-color: transparent;
    box-shadow: none;
  }
  .customizer-toggle {
    display: none !important;
  }

  // Invoice Specific Styles
  .invoice-preview-wrapper {
    .row.invoice-preview {
      .col-md-8 {
        max-width: 100%;
        flex-grow: 1;
      }

      .invoice-preview-card {
        .card-body:nth-of-type(2) {
          .row {
            > .col-12 {
              max-width: 50% !important;
            }

            .col-12:nth-child(2) {
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
              margin-top: 0 !important;
            }
          }
        }
      }
    }

    // Action Right Col
    .invoice-actions {
      display: none;
    }
  }
}
</style>
