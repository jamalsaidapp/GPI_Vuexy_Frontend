export default [
  {
    path: '/helpdesk/tickets/',
    name: 'tickets',
    component: () => import('@/views/helpdesk/Tickets.vue'),
    meta: {
      resource: 'helpdesk',
      pageTitle: 'Helpdesk',
      breadcrumb: [
        {
          text: 'Mes Tickets',
          active: true,
        },
      ],
    },
  },
  {
    path: '/helpdesk/tickets_rapport/',
    name: 'tickets_rapport',
    component: () => import('@/views/helpdesk/Rapport_Tickets.vue'),
    meta: {
      resource: 'helpdesk',
      pageTitle: 'Helpdesk',
      breadcrumb: [
        {
          text: 'Rapport des Tickets',
          active: true,
        },
      ],
    },
  },
]
