<template>
  <section class="invoice-preview-wrapper p-1">

    <!-- Alert: No item found -->
    <b-alert
      variant="danger"
      :show="showError"
    >
      <h4 class="alert-heading">
        Erreur Collection Ordinateurs
      </h4>
      <div class="alert-body">
        Aucun Ordinateur Trouvé pour ce Salarie. Verifie
        <b-link
          class="alert-link"
          :to="{ name: 'affectations_pc'}"
        >
          Affectations PCs.
        </b-link>
        <a
          class="alert-link ml-1"
          href="javascript:window.open('','_self').close();"
        >
          Fermer!
        </a>
      </div>
    </b-alert>

    <b-row
      v-if="!showError"
      class="invoice-preview"
    >
      <b-col
        cols="12"
        xl="10"
        md="8"
      >
        <b-card
          id="element-to-print"
          no-body
          class="invoice-preview-card p-1"
        >
          <table class="table table-bordered">
            <thead>
              <tr>
                <td
                  class="text-center"
                  rowspan="3"
                  style="width: 30%; padding-left: 0.5rem;"
                >
                  <logo style="width: 85%" />
                </td>
                <td
                  rowspan="3"
                  class="text-center text-black"
                >
                  <label class="text-black">Système Management Qualité</label>
                  <hr>
                  <label class=" text-black">Fiche d'affectation Matériel Informatique </label>
                </td>
                <td class="text-center text-black">
                  Réf : Pc_S02_FAMI_V01
                </td>
              </tr>
              <tr>
                <td class="text-center text-black">Date de
                  validation : 23/10/2020
                </td>
              </tr>
              <tr>
                <td class="text-center text-black">Date
                  d'application : 23/10/2020
                </td>
              </tr>
            </thead>
          </table>

          <!-- Spacer -->
          <hr
            class="invoice-spacing m-6"
            style="border-color: transparent"
          >
          <hr
            class="invoice-spacing m-2"
            style="border-color: transparent"
          >

          <b-col class="ml-2">
            <h6 class="mb-2">
              <span class="mr-1">√</span> Affectation à : <span class="title-value">{{ salarie.full_name }}</span>
            </h6>
            <h6 class="mb-2">
              <span class="mr-1">√</span> Projets  : <span class="title-value">{{ salarie.projets }}</span>
            </h6>
          </b-col>

          <!-- Spacer -->
          <hr
            class="invoice-spacing m-6"
            style="border-color: transparent"
          >
          <hr
            class="invoice-spacing m-1"
            style="border-color: transparent"
          >

          <table class="table table-bordered">
            <thead>
              <tr class="text-center text-black">
                <th>Article</th>
                <th>Numéro de Série (S/N)</th>
                <th>Date d'affectation</th>
                <th>Remarque</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item , index) in selectedPcs"
                :key="index"
                class="text-center text-black"
              >
                <td>{{ item.marque }} {{ item.reference }}, {{ item.processor }}, {{ item.ram }} RAM, {{ item.disk }}</td>
                <td>{{ item.sn }}</td>
                <td>{{ item.pivot.affected_at }}</td>
                <td>{{ item.pivot.remarque }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Spacer -->
          <hr
            class="invoice-spacing m-6"
            style="border-color: transparent"
          >
          <hr
            class="invoice-spacing m-6"
            style="border-color: transparent"
          >
          <hr
            class="invoice-spacing m-6"
            style="border-color: transparent"
          >

          <table
            id="signe_area"
            class="table table-bordered"
          >
            <thead>
              <tr>
                <th
                  class="text-center text-black"
                  style="width: 50%;"
                >
                  Signature Ressource avec CIN
                </th>
                <th
                  class="text-center text-black"
                  style="width: 50%;"
                >
                  Signature du Responsable hiérarchique
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style="height: 150px;">
                <td />
                <td />
              </tr>
            </tbody>
          </table>

        </b-card>
      </b-col>

      <b-col
        cols="12"
        md="2"
        xl="2"
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
            Imprimer
          </b-button>

          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            v-b-toggle.sidebar-send-invoice
            variant="outline-secondary"
            class="mb-75"
            block
          >
            Envoyer
          </b-button>
          <v-select
            v-model="selectedPcs"
            input-id="salarie_id"
            placeholder="Ordinateurs ..."
            label="sn"
            multiple
            :options="laptops"
          />
        </b-card>
      </b-col>
    </b-row>

  </section>
</template>

<script>
import {
  BRow, BCol, BCard, BButton, BAlert, BLink, VBToggle,
} from 'bootstrap-vue'
import Logo from '@core/layouts/components/Logo'
import Ripple from 'vue-ripple-directive'

export default {
  name: 'Print',
  directives: {
    Ripple,
    'b-toggle': VBToggle,
  },
  components: {
    BRow,
    BCol,
    BCard,
    BButton,
    BAlert,
    BLink,
    Logo,
  },
  data() {
    return {
      selectedPcs: [],
      showError: false,
    }
  },
  computed: {
    laptops() {
      const { data } = this.$route.query
      if (typeof data === 'string' && this.tryParseJSONObject(data)) {
        return JSON.parse(data).affected_laptops
      }
      return []
    },
    salarie() {
      const { data } = this.$route.query
      if (typeof data === 'string' && this.tryParseJSONObject(data)) {
        return JSON.parse(data)
      }
      return []
    },
  },
  async created() {
    this.selectedPcs = this.laptops
    this.showError = this.laptops.length === 0
  },
  methods: {
    print() {
      window.print()
    },
    tryParseJSONObject(jsonString) {
      try {
        const o = JSON.parse(jsonString)
        if (o && typeof o === 'object') {
          return o
        }
      } catch (e) {
        console.log(e)
      }
      return false
    },
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
  .title-value{
    font-weight: 800;
    margin-left: 10px;
  }
  .table thead tr{
    color: black !important;
  }
.table thead tr label{
  color: black !important;
  font-size: 14px;
}
  .table tbody tr{
    color: black !important;
    font-weight: 400;
  }
h6 {
  color: #161313 !important;
  font-size: 16px !important;
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
