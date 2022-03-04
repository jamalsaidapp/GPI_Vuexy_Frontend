<!-- eslint-disable -->
<template>
  <div>
    Tickets
    <Can
      I="read"
      a="helpdesk"
    >
      You are allowed to View this page
    </Can>
  </div>
</template>

<script>
import { Can } from '@casl/vue'

export default {
  name: 'Tickets',
  components: {
    Can,
  },
}
</script>

<style scoped>

</style>
