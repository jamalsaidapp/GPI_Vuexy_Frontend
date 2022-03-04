<template>
  <div v-if="field === 'status'">
    <b-badge :variant="UserStatus(slotProps)">
      {{ slotProps }}
    </b-badge>
  </div>
  <div v-else-if="field === 'role'">

    <div class="text-nowrap">
      <feather-icon
        :icon="UserRoleIcon(slotProps)"
        size="18"
        class="mr-50"
        :class="`text-${UserRole(slotProps)}`"
      />
      <span
        v-if="slotProps.length > 0"
        class="align-text-top text-capitalize"
      >{{ slotProps[0].name }}</span>
      <span
        v-else
        class="align-text-top text-capitalize"
      >No Role</span>
    </div>
  </div>
</template>

<script>
import { BBadge } from 'bootstrap-vue'

export default {
  name: 'CustomCols',
  components: {
    BBadge,
  },
  props: {
    field: {
      type: String,
      required: true,
    },
    slotProps: {
      type: [String, Array],
      required: true,
    },
  },
  methods: {
    UserStatus(status) {
      if (status === 'Active') return 'success'
      if (status === 'Inactive') return 'danger'
      return 'primary'
    },
    UserRole(role) {
      if (role[0]?.name === 'admin') return 'primary'
      if (role[0]?.name === 'user') return 'secondary'
      return 'danger'
    },
    UserRoleIcon(role) {
      if (role[0]?.name === 'user') return 'UserIcon'
      if (role[0]?.name === 'admin') return 'ServerIcon'
      return 'XOctagonIcon'
    },
  },
}
</script>

<style scoped>

</style>
